Game.Object = function(object) {
  if (this instanceof Game.Object) {
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
        arg = Game.Value(arg);
      array.push(arg);
    }
    var id = Game.Object.Value(array, 'id');
    if (id != null)
      Game.Object[id] = array;
    return array;
  }
  return Game.Object[object]// || throw "can't find"
};

Game.Object.inspect = function(object) {
  return object.map(function(property) {
    var parsed = Game.Property(property)
    var value = typeof parsed.value == 'undefined' ? null : parsed.value
    return [parsed.type._path, value]
  })
}

// get object property value
Game.Object.Value = function() {
  var equipment = Game.Value.Range('equipment')
  var properties = Game.Value.Range('properties')

  return (Game.Object.Value = function(object, type, r1, r2, r3) {
    if (typeof type != 'number')
      type = Game.Value(type)
    var result;
    var range = Math.pow(10, 4 - (Math.floor(Math.log(type) / Math.LN10) + 1))
    var start = type * range;
    if (r1 != null)
      var query = Game.Reference.Value(r1, r2, r3);
    for (var i = 0, j = object.length; i < j; i++) {
      // parse each property in array
      var property = object[i];
      var negate = property < 0;
      if (negate)
        property = - property;
      var digits = Math.floor(Math.log(property) / Math.LN10) + 1;
      var divisor = Math.pow(10, digits - 4);
      var kind = Math.floor(property / divisor);
      if (kind >= start && kind < start + range) {
        var value = property - kind * divisor
        if (value >= 1000) {
          divisor /= 1000
          var val = Math.floor(value / divisor)
          var reference = value - val * divisor;
          if (query != reference)
            continue;
          divisor /= 10
          var ref = Math.floor(reference / divisor)
          value = val
        } else if (query)
          continue
        if (negate)
          value = - value
        result = (result || 0) + value
      // handle game data reference (type of creature, action or item)
      } else if (kind > properties + 1000) {
        var reference = Game[kind];
        var values = Game.Reference.Values(reference)
        if (values) {
          var inherited = Game.Object.Value(values, type);
          if (inherited != null)
            result = (result || 0) + inherited;
        }
      // iterate equipped items
      } else if (kind >= equipment && kind < equipment + 10) {
        if (inherit == null)
          var inherit = Game[type].inherit || false;
        if (inherit) {
          var remainder = property - kind * divisor
          divisor /= 1000
          var number = Math.floor(remainder / divisor)
          remainder -= number * divisor;
          var obj = Game.Reference(remainder)
          var referenced = Game.Object.Value(obj, type);
          if (referenced != null)
            result = (result || 0) + referenced;
        }
      // location
      } else if (kind < 2000) {
        if (type == 1000)
          return property;
      }
    }
    return result;
  }).apply(this, arguments)
}

// set object property
Game.Object.set = function(object, type, value, r1, r2, r3) {
  if (typeof type != 'number')
    type = Game.Value(type)
  var result;
  for (var i = 0, j = object.length; i < j; i++) {
    // parse each property in object
    var prop = object[i];
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
  object[i] = Game.Value(type, value, r1, r2, r3);
  var property = Game[type];
  if (property.set)
    property.set.call(object, value, old || 0, property, reference);
}

// modify property by given amount
Game.Object.increment = function(object, type, value, reference) {
  if (typeof type != 'number')
    type = Game.Value(type)
  var result;
  for (var i = 0, j = object.length; i < j; i++) {
    // parse each property in object
    var prop = object[i];
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
  object[i] = Game.Value(type, value, reference);
  var property = Game[type];
  if (property.set)
    property.set.call(object, value, old || 0, property, reference);
  return value;
}

// iterate referenced memes (creature, item)
Game.Object.Types = function(object, callback) {
  var resources = Game.Value.Range('resources');

  return (Game.Object.Types = function(object, callback) {
    for (var i = 0, j = object.length; i < j; i++) {
      // parse each property in object
      var value = object[i];
      var negate = value < 0;
      if (negate)
        value = - value;
      var digits = Math.floor(Math.log(value) / Math.LN10) + 1;
      var divisor = Math.pow(10, digits - 4);
      var kind = Math.floor(value / divisor);
      //handle ref erence (type of creature or item)
      if (kind > resources + 1000)
        callback.call(object, Game[kind], value + kind * divisor);
    }
  }).apply(this, arguments)
}

// iterate referenced objects
Game.Object.References = function(object, callback) {
  var equipment = Game.Value.Range('equipment');
  var occupy = Game.Value.Range('occupy');

  return (Game.Object.References = function(object, callback) {
    for (var i = 0, j = object.length; i < j; i++) {
      // parse object properties
      var value = object[i];
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
        var obj = Game.Object(reference)
        var res = callback.call(object, obj, kind, result);
        if (typeof res != 'undefined')
          var result = res;
      }
    }
    return result;
  }).apply(this, arguments);
}
Game.Object.Objects = Game.Object.References;

// find object property of given type
// that has the highest value
Game.Object.max = function(object, type, baseline) {
  if (typeof type != 'number')
    type = Game.Value(type);
  if (baseline == null)
    var baseline = 0;
  var result;
  var range = Math.pow(10, 4 - (Math.floor(Math.log(type) / Math.LN10) + 1))
  type *= range;
  for (var i = 0, j = object.length; i < j; i++) {
    // parse each property in object
    var value = object[i];
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

// Set object's time
Game.Object.Time = function(object, time) {
  if (time % 4 == 0)
    Game.Object.increment(object, 'hunger', 1);
};

// Resolve object's path
Game.Object.Path = function(object, callback, max, levels, output) {
  var id = Game.Object.ID(object);
  object = Game.Object(id);
  if (callback == null)
    return output || Game.Object.Output(id, 'walk');
  var vector = Game.Object.Vector(id)
  var map = Game.Object.Map(id);
  return Game.Path.call(object, map, object, callback, max, levels, output, vector)
};

// Get/set object location
Game.Object.Location = function(object, value) {
  var map = this.tileAt ? this : Game.Object.Map(object);
  var coordinates = Game.Object.Coordinates(object);
  var location = map.tileAt(coordinates);
  if (value == null) {
    return location
  } else {
    return map.move(location, value, object);
  }
};

// Get/set object's coordinates
Game.Object.Coordinates = function(object, value) {
  if (typeof object == 'number')
    object = Game.Object[object];
  return Game.Object.max(object, 1)
};

// Get/set map that object belongs to
Game.Object.Map = function(object, value) {
  var id = Game.Object.ID(object)
  if (value == null)
    return Game.Object.maps[id];
  else
    return Game.Object.maps[id] = value;
};
Game.Object.maps = {};

// store intermediate computations between ticks
Game.Object.Output = function(object, type, value) {
  var id = Game.Object.ID(object)
  var outputs = Game.Object.outputs;
  var output = (outputs[type] || (outputs[type] = {}))
  if (value == null)
    return output[id];
  else if (value !== false)
    return output[id] = value;
  else
    delete output[id];
}
Game.Object.outputs = {};

// get object's moving vector
Game.Object.Vector = function(object, value) {
  var id = Game.Object.ID(object)
  var vectors = Game.Object.vectors;
  if (value == null)
    return vectors[id]
  else
    return vectors[id] = value
}
Game.Object.vectors = {};

// get object id
Game.Object.ID = function(object) {
  if (typeof object == 'number')
    return object;
  var id = Game.Object.Value(object, 'id');
  if (id == null) {
    id = ++Game.Object.id
    Game.Object[id] = object;
    Game.Object.set(object, 'id', id);
  }
  return id;
}
Game.Object.id = 0;

// Execute a quest with highest priority,
// if that adds a more important quest, execute it too
Game.Object.Quests = function(object) {
  for (var current = null, prev = null; 
      (current = Game.Object.max(object, 'quests')) != prev;
      prev = current)
    Game.Object.Quest(object, current);
}

Game.Object.Quest = Game.Quest;

Game.Object.Action = Game.Action;