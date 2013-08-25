Game.Object = function(object) {
  if (!object || !object.push) {
    var i = 0;
    var array = [];
  } else {
    var i = 1
    var array = object;
  }
  for (var arg, j = arguments.length; i < j; i++) {
    var arg = arguments[i]; 
    if (typeof arg == 'string')
      arg = Game.valueOf(arg);
    array.push(arg);
  }
  var id = Game.Object.get(array, 'id');
  if (id != null)
    Game.Object[id] = array;
  return array;
};


Game.Object.getID = function() {
  return (Game.Object.id = (Game.Object.id || 0) + 1)
};

Game.Object.find = function(id) {
  return Game.Object[id]// || throw "can't find"
};

Game.Object.retrieve = function(id) {

};

Game.Object.store = function(id, object) {

};

// get object property value
Game.Object.get = function() {
  var equipment = Game.valueOf('equipment') * 10
  var properties = Game.valueOf('properties') * 1000

  return (Game.Object.get = function(array, type) {
    if (type !== +type)
      type = Game.valueOf(type)
    var result;
    for (var i = 0, j = array.length; i < j; i++) {
      // parse each property in array
      var value = array[i];
      var negate = value < 0;
      if (negate)
        value = - value;
      var digits = Math.floor(Math.log(value) / Math.LN10) + 1;
      var divisor = Math.pow(10, digits - 4);
      var kind = Math.floor(value / divisor);
      if (kind == type) {
        if (negate) {
          result = (result || 0) - value + kind * divisor
        } else {
          result = (result || 0) + value - kind * divisor
        }
      //handle ref erence (type of creature or item)
      } else if (kind > properties + 1000) {
        var reference = Game[kind];
        var inheritable = reference._inheritable;
        if (inheritable === undefined) {
          for (var property in reference) {
            var value = reference[property];
            var number = Game.valueOf(property)
            if (number) {
              var definition = Game[number];
              if (definition.inherit) {
                if (!inheritable)
                  inheritable = [];
                inheritable.push(Game.valueOf(number, reference[property]))
              }
            }
          }
          reference._inheritable = inheritable || null;
        }
        if (inheritable) {
          var inherited = Game.Object.get(inheritable, type);
          if (inherited != null)
            result = (result || 0) + inherited;
        }
      // iterate equipped items
      } else if (kind >= equipment && kind < equipment + 10) {
        if (inherit == null)
          var inherit = Game[type].inherit || false;
        if (inherit) {
          var remainder = value - kind * divisor
          divisor /= 1000
          var number = Math.floor(remainder / divisor)
          remainder -= number * divisor;
          divisor /= 10
          var ref = Math.floor(remainder / divisor)
          var reference = remainder - ref * divisor;
          if (ref == 2) {
            var obj = Game.Object.find(reference)
            var referenced = Game.Object.get(obj, type);
            if (referenced != null)
              result = (result || 0) + referenced;
          }
        }
        // location
      } else if (kind < 2000) {
        if (type == 1)
          return value;
      }
    }
    return result;
  }).apply(this, arguments)
}

// set object property
Game.Object.set = function(array, type, value, r1, r2, r3) {
  if (type !== +type)
      type = Game.valueOf(type)
  var result;
  for (var i = 0, j = array.length; i < j; i++) {
    // parse each property in array
    var prop = array[i];
    var negate = prop < 0;
    if (negate)
      prop = - prop;
    var digits = Math.floor(Math.log(prop) / Math.LN10) + 1;
    var divisor = Math.pow(10, digits - 4);
    var kind = Math.floor(prop / divisor);
    if (kind == type) {
      var old = prop - kind * divisor
      if (negate)
        old = - old
      break;
    }
  }
  array[i] = Game.valueOf(type, value, r1, r2, r3);
  var property = Game[type];
  if (property.set) {
    property.set.call(array, value, old || 0, property, r1, r2, r3);
  }
}

// modify property by given amount
Game.Object.increment = function(array, type, value, r1, r2, r3) {
  if (type !== +type)
      type = Game.valueOf(type)
  var result;
  for (var i = 0, j = array.length; i < j; i++) {
    // parse each property in array
    var prop = array[i];
    var negate = prop < 0;
    if (negate)
      prop = - prop;
    var digits = Math.floor(Math.log(prop) / Math.LN10) + 1;
    var divisor = Math.pow(10, digits - 4);
    var kind = Math.floor(prop / divisor);
    if (kind == type) {
      var old = prop - kind * divisor
      if (negate) {
        value -= old
      } else {
        value += old
      }
      break;
    }
  }
  array[i] = Game.valueOf(type, value, r1, r2, r3);
  var property = Game[type];
  if (property.set)
    property.set.call(array, value, old || 0, property, r1, r2, r3);
  return value;
}

// iterate referenced memes (creature, item)
Game.Object.identify = function(array, callback) {
  var resources = Game.valueOf('resources') * 1000;
  return (Game.Object.identify = function(array, callback) {
    for (var i = 0, j = array.length; i < j; i++) {
      // parse each property in array
      var value = array[i];
      var negate = value < 0;
      if (negate)
        value = - value;
      var digits = Math.floor(Math.log(value) / Math.LN10) + 1;
      var divisor = Math.pow(10, digits - 4);
      var kind = Math.floor(value / divisor);
      //handle ref erence (type of creature or item)
      if (kind > resources + 1000) {
        callback.call(array, Game[kind], value + kind * divisor);
      }
    }
  }).apply(this, arguments)
}

// iterate referenced objects
Game.Object.each = function(array, callback) {
  var equipment = Game.valueOf('equipment') * 10
  var occupy = Game.valueOf('occupy');

  return (Game.Object.each = function(array, callback) {
    for (var i = 0, j = array.length; i < j; i++) {
      // parse each property in array
      var value = array[i];
      var negate = value < 0;
      if (negate)
        value = - value;
      var digits = Math.floor(Math.log(value) / Math.LN10) + 1;
      var divisor = Math.pow(10, digits - 4);
      var kind = Math.floor(value / divisor);
      // iterate referenced objects
      if (
        (kind >= equipment && kind < equipment + 10) ||
        (kind == occupy)
      ) {
        var remainder = value - kind * divisor
        divisor /= 1000
        var number = Math.floor(remainder / divisor)
        remainder -= number * divisor;
        divisor /= 10
        var ref = Math.floor(remainder / divisor)
        var reference = remainder - ref * divisor;
        var obj = Game.Object.find(reference)
        callback.call(array, obj, kind);
      }
    }
  }).apply(this, arguments);
}

// find object property of given type
// that has the highest value
Game.Object.max = function(array, type, baseline) {
  if (typeof type != 'number')
    type = Game.valueOf(type);
  if (baseline == null)
    var baseline = 0;
  var result;
  var range = Math.pow(10, 4 - (Math.floor(Math.log(type) / Math.LN10) + 1))
  type *= range;
  for (var i = 0, j = array.length; i < j; i++) {
    // parse each property in array
    var value = array[i];
    var negate = value < 0
    if (negate)
      value = - value;
    var digits = Math.floor(Math.log(value) / Math.LN10) + 1;
    var divisor = Math.pow(10, digits - 4);
    var kind = Math.floor(value / divisor);
    var old = value - kind * divisor
    if (negate)
      old = - old
    if (kind >= type && kind < type + range) {
      if (old > baseline || result == null) {
        baseline = old;
        var result = value;
      }
    }
  }
  return result
}

// find path for creature
// stores all intermediate computations 
// to resume pathfinding on next tick
Game.Object.walk = function(object, callback, max, levels, output) {
  var id = Game.Object.get(object, 'id');
  var world = Game.maps[id]
  var location = Game.Object.get(object, 1);
  var start = location;
  var vector = Game.vectors[id];
  var path = output && output.result;
  if (path && path.length) {

    // resume previous path at its best node 
    start = path[0][0];

    // increase max. range to visit more nodes
    if (levels == null) {
      var prev = path[path.length - 2];
      if (prev) {
        var last = prev[0];
        var pos = output.locations.indexOf(last);
        if (pos > -1)
          max += output.distances[pos]
      }
    }
  }

  // launch pathfinding on a given map zoom level
  // may zoom out when reached pathfinding limit 
  var limit = (levels || 0) + 1
  var result = output && output.result;
  loop: for (var level = 0; level < limit; level++) {

    // optimize path
    if (result && result.length) {
      var i = levels ? level - 1 : result.length - 1
      for (var node; node = result[i];) {
        var pos = output.locations.indexOf(pos);
        var distance = output.distances[pos];
        var quality = callback.call(world, node, distance, i, output);
        switch (quality) {
          case -Infinity:
            if (!levels || result[i + 1]) {
              var j = levels ? i + 1 : i;
              var removed = result.splice(j, result.length - i);
              if (!levels) {
                output.result = removed; 
                break loop;
              } else {
                break loop;
              }
            }
        }
        if (levels)
          break;
        else
          i--
      }
    }

    if (levels && output
    && output.qualities[output.qualities.length - 1] == -Infinity
    && output.result[level] == null)
      break;

    if (levels) {

      // move to parent zone
      if (level > 1) {
        var prev = start;
        start = world.up(level == 2 ? location : start);
        if (world.zone == start)
          break;
        if (vector) {
          if (!z)
            var z = world.opposite(location, vector)
          z = world.up(z);
          if (z == start) {
            break;
          }
        }
      }
      if (level > 0)
        output = world.walk(start, callback, max, level - 1, vector, output)
    } else {
      if (output && output.result.length)
        debugger
      output = world.walk(start, callback, max, null, null, output)
    }
  }
  return output;
}

// Execute and schedule subquests  
Game.Object.invoke = function(array, type, value, ref, r1, r2, id) {
  var result;
  for (var i = 0, action; action = type.steps[i++];) {
    var t = Game.typeOf(action);
    var p = Game.valueOf(action)
    var quest = Game[t];
    if (quest.execute) {
      var output = quest.output && (Game.output[quest.output] || (Game.output[quest.output] = {}))
      var cache = output && output[id];
      if (cache == null)
        console.info('step', [quest._path])
      if (quest.condition && quest.condition.call(array, argument, cache, quest, value, ref, r1, r2)) { 
        if (!quest.complete || quest.complete.call(array, argument, cache, quest, value, ref, r1, r2) !== false) {
          console.info('done', [quest._path])
          if (quest.cleanup)
            quest.cleanup.call(array, argument, result, quest, value, ref, r1, r2);

          if (output)
            output[id] = null;

          if (!type.steps[i]) {
            console.log('cleanup', type._reference, array)
            Game.Object.set(array, type, 0)
            break;
          }
          //Game.Object.set(array, type, 0, ref, r1, r2)
          //break;
        }
      } else {
        var result = quest.execute.call(array, argument, cache, quest, value, ref, r1, r2);
      }
      if (output)
        output[id] = result
      var argument = result;
    } else {
      if (!quest.precondition || quest.precondition.call(this)) {
        var o = Game.Object.get(array, t);
        if (!o)
          Game.Object.increment(array, t, p, ref, r1, r2)
      }
    }
  }
}