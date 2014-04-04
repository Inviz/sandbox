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
        arg = Game.Attribute(arg);
      array.push(arg);
    }
    var id = Game.Object.Value(array, 'id');
    if (id != null)
      Game.Object[id] = array;
    return array;
  }
  return Game.Object[object]// || throw "can't find"
};

Game.Object.Quest = Game.Quest;
Game.Object.Action = Game.Action;

Game.Object.inspect = function(object) {
  return object.map(function(property) {
    var parsed = Game.Property(property)
    var value = typeof parsed.value == 'undefined' ? null : parsed.value
    return [parsed.type._path, value]
  })
}

// Set object's time
Game.Object.Time = function(object, time) {
  if (time % 4 == 0)
    Game.Object.Value.increment(object, 'hunger', 1);
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
  return Game.Object.Attribute.get(object, 1)
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
    Game.Object.Value.set(object, 'id', id);
  }
  return id;
}
Game.Object.id = 0;

// Execute a quest with highest priority,
// if that adds a more important quest, execute it too
Game.Object.Quests = function(object) {
  for (var current = null, prev = null; 
      (current = Game.Object.Attribute.max(object, 'quests')) != prev;
      prev = current)
    Game.Object.Quest(object, current);
}

// Generate all combinations of iterator scopes
Game.Scopes(Game.Object, 
  ['Self', 'Value', 'Attribute'], 
  ['Properties', 'Definitions', 'References', 'Equipment', 'Effects']
);