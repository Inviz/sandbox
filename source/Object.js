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

// Add or remove from property value
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

// iterate referenced memes
Game.Object.identify = function(array, callback) {
  var properties = Game.valueOf('properties') * 1000;
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
      if (kind > properties + 1000) {
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

// find path for a creature
// stores all intermediate computations 
// to resume pathfinding on next tick
Game.Object.walk = function(object, callback, max, type, levels) {
  var id = Game.Object.get(object, 'id');
  var world = Game.maps[id]
  var location = Game.Object.get(object, 1);
  var start = location;
  if (!type)
    type = 'walk';
  visited = (Game.visiteds[type] || (Game.visiteds[type] = {}))
  var visited = (visited[id] || (visited[id] = []))
  var paths = (Game.paths[type] || (Game.paths[type] = {}));
  var path = (paths[id] || (paths[id] = []))
  var queues = (Game.queues[type] || (Game.queues[type] = {}));
  var queue = (queues[id] || (queues[id] = []))
  var vector = Game.vectors[id];

  if (path && path.length) {

    // resume previous path at its best node 
    start = path[0][0];

    // increase max. range to visit more nodes
    if (levels == null) {
      var last = path[path.length - 2][0];
      for (var pos = -1; (pos = visited.indexOf(last, pos + 1)) != -1;)
        if (pos % 5 == 0)
          break;
      if (pos > -1)
        max += visited[pos + 1]
    }
  }

  // launch pathfinding on a given map zoom level
  // may zoom out when reached pathfinding limit 
  var limit = (levels || 0) + 1
  for (var level = 0; level < limit; level++) {
    // don't find path if there's a stored result for this level
    if (!levels) {
      level++;
    }
    var result = path[level - 1];
    if (result) {
      for (var pos = -1; (pos = visited.indexOf(result[0], pos + 1)) != -1;)
        if (pos % 5 == 0)
          break;
      if (visited[pos + 2] == -Infinity)
        break;
    }

    if (levels) {
      // move to parent zone
      if (level > 1) {
        start = world.up(level == 2 ? location : start);
        if (world.zone == start)
          break;
      }
      if (level > 0)
        world.walk(start, callback, visited, path, queue, max, level - 1, vector)
    } else {
      world.walk(start, callback, visited, path, queue, max)
    }
  }
  return path;
}