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
  var equipment = Game.Type.Range('equipment')
  var properties = Game.Type.Range('properties')

  var old = Game.Object.Value;
  Game.Object.Value = function(object, type, reference, callback, method, arg, recursive) {
    if (object._index) {
      if (object._length === undefined)
        object = Game.Type.Properties(object);
      var j = object._length;
      if (!j)
        return;
    } else {
      var j = object.length;
    }

    if (typeof reference == 'function') {
      callback = reference;
      reference = null;
    }
    type = Game.Type(type)
    var result;
    var range = type > 999 ? 1 : type > 99 ? 10 : type > 9 ? 100 : 1000;
    var start = type * range, end = start + range;
    if (typeof method != 'function')
      method = Game.Object.Value[method || 'sum'];
    if (!recursive)
      recursive = method.own;

    var ref, value, now, subject, mapped;
    for (var i = 0; i < j; i++) {
      // parse each property in array
      var kind = object[i];
      var multiplier = kind < 0 ? -1 : 1;
      kind *= multiplier;
      value = ref = now = subject = mapped = null;
      var origin = reference;
      if (kind > 9999999) {
        ref = kind % 1000000000;
        kind = Math.floor((kind - ref) / 1000000000);
      }
      if (kind > 9999) {
        value = (kind % 1000) * multiplier;
        kind = Math.floor((kind - value) / 1000);
      }
      // check if property matches given type
      if (recursive && kind >= start && kind < end && ref == (reference || 0)) {
        now = value;
      // handle game data reference (type of creature, action or item)
      } else if (method.references && kind > properties + 1000) {
        subject = Game[kind]
        if (method.output == null)
          now = value;
      // handle equipment
      } else if (method.equipment && kind >= equipment && kind < equipment + 10) {
        if (inherit == null)
          var inherit = Game[type].inherit || false;
        if (inherit)
          subject = Game.Referenced(ref);
      }
      // process referenced object
      if (subject) {
        now = method(subject, type, reference, callback, true);
        if (now != null) {  
          var n = now < 0 ? -1 : 1;
          now *= n;
          if (now > 9999999) {
            origin = now % 1000000000;
            now = Math.floor((now - origin) / 1000000000);
          }
          if (now > 9999) {
            value = now % 1000;
            kind = Math.floor((now - value) / 1000);
            now = value;
          }
          now *= n;
        }
      }
      if (now != null) {
        var r = (origin == null ? ref : origin) || null
        var transformed = now;
        if (callback && (method.output == null || !subject)) {
          var mapped = callback(subject || object, Game[kind], transformed, r, arg);
          if (typeof mapped == 'number')
            transformed = mapped;
        }
        if (method.iterator) {
          var mapped = method.iterator(result, transformed, object, Game[kind], r, arg);
          if (mapped !== result) {
            var resulting = kind;
            result = mapped;
          }
        } else {
          result = transformed;
        }
        if (method.single)
          break;
      }
      // location
      if (kind < 2000 && type == 1000)
        return object[i];
    }
    if (method.reducer)
      return method.reducer(result, object, type, reference, arg, i, value)
    else if (method.output === false && typeof result == 'number')
      return Game.Value(resulting || type, result, reference);
    else
      return result;
  }
  for (var property in old)
    Game.Object.Value[property] = old[property]
  return Game.Object.Value.apply(this, arguments)
};

Game.Object.Scope = function(options, overrides, flat, scope, mutable) {
  if (scope == null)
    if (options.setter)
      var scope = function(object, type, value, reference, callback, recursive) {
        return Game.Object.Value(object, type, reference, callback, scope, value, recursive)
      }
    else
      var scope = function(object, type, reference, callback, recursive) {
        return Game.Object.Value(object, type, reference, callback, scope, undefined, recursive)
      }
  for (var option in options)
    if (!options[option].scope)
      scope[option] = options[option];
  if (overrides)
    for (var option in overrides)
      if (!overrides[option].scope)
        scope[option] = overrides[option];
  scope.scope = true;
  if (mutable) {
    scope.set = Game.Object.Value.set;
    scope.increment = Game.Object.Value.increment;
    scope.decrement = Game.Object.Value.decrement;
  }
  if (!options.setter && !flat) {
    var Iterator = Game.Object.Scope;
    for (var property in Iterator)
      if (scope[property] == null && Iterator[property].scope) {
        scope[property] = new Game.Object.Scope(Iterator[property], scope, true);
      }
  }
  return scope; 
}


Game.Object.Scope.sum = new Game.Object.Scope({
  iterator: function(sum, value) {
    return (sum || 0) + value;
  }
})

Game.Object.Scope.max = new Game.Object.Scope({
  iterator: function(max, value) {
    return Math.max(max || 0, value);
  }
})

Game.Object.Scope.min = new Game.Object.Scope({
  iterator: function(min, value) {
    return Math.min(min || 0, value);
  }
})

// Return value
Game.Object.Scope.Value = new Game.Object.Scope({
  output: true
})

// Return property (type + value + reference)
Game.Object.Scope.Property = new Game.Object.Scope({
  output: false
})

// Return first result
Game.Object.Scope.get = new Game.Object.Scope({
  single: true
})

// Return array of results
Game.Object.Scope.map = new Game.Object.Scope({
  iterator: function(result, value, object, type, reference) {
    if (!result)
      result = [];
    if (this.output === false)
      result.push(Game.Value(type, value, reference));
    else
      result.push(value)
    return result;
  }
})

// Unscoped setters
Game.Object.Value.set = new Game.Object.Scope({
  setter: true,
  single: true,
  own: true,
  reducer: function(result, object, type, reference, arg, i) {
    return object[i] = Game.Value(type, arg, reference)
  }
})

Game.Object.Value.increment = new Game.Object.Scope({
  setter: true,
  single: true,
  own: true,
  reducer: function(result, object, type, reference, arg, i, value) {
    return object[i] = Game.Value(type, arg + (value || 0), reference);
  }
})

Game.Object.Value.decrement = new Game.Object.Scope({
  setter: true,
  single: true,
  own: true,
  reducer: function(result, object, type, reference, arg, i, value) {
    return object[i] = Game.Value(type, arg - (value || 0), reference);
  }
})

Game.Object.Scope.config = {
  equipment: true,
  references: true,
  effects: true,
  definitions: true,
  own: true,
  output: true
}

// set own properties, get total value
Game.Object = new Game.Object.Scope(
  Game.Object.Scope.config, null, null, Game.Object, true);

// Get and set value by matching reference
Game.Object.Value = new Game.Object.Scope(
  Game.Object.Scope.config, Game.Object.Scope.Value, 
  null, Game.Object.Value, true);

// Return property (value with type and optional reference, internal format)
Game.Object.Property = new Game.Object.Scope(
  Game.Object.Scope.config, Game.Object.Scope.Property, 
  null, Game.Object.Property, true);

// Referenced objects
Game.Object.References = new Game.Object.Scope({
  references: true
});

// Equipment items
Game.Object.Equipment = new Game.Object.Scope({
  equipment: true
});

// Actions, spells, auras
Game.Object.Effects = new Game.Object.Scope({
  effects: true
});

// Own properties
Game.Object.Stats = new Game.Object.Scope({
  own: true
});

// Game data definitions
Game.Object.Definitions = new Game.Object.Scope({
  definitions: true
});

// pre-generate all possible scope combinations
!function(methods, scopes) {
  var combinations = [];
  for (var a, i = 0; a = scopes[i++];) {
    combinations.push([a]);
    for (var b, j = 0; b = scopes[j++];) { 
      if (b == a) continue;
      combinations.push([a, b]);
      for (var c, k = 0; c = scopes[k++];) {
        if (c == a || c == b) continue;
        combinations.push([a, b, c]);
        for (var d, l = 0; d = scopes[l++];) {
          if (d == a || d == b || d == c) continue;
          combinations.push([a, b, c, d]);
          for (var e, m = 0; e = scopes[m++];) {
            if (e == a || e == b || e == c || e == d) continue;
            combinations.push([a, b, c, d, e]);
          }
        }
      }
    }
  }
  var generated = {};
  combinations = combinations.sort(function(a, b) {
    return (a.length + a.toString() > b.length + b.toString()) ? 1 : -1;
  })
  for (var method, i = 0; method = methods[i++];)
    for (var combo, j = 0; combo = combinations[j++];) {
      var subject = Game.Object;
      for (var k = 0, l = combo.length - 1; k < l; k++)
        subject = subject[combo[k]]
      var key = combo[k];

      var string = combo.sort() + method;
      var cache = generated[string]
      if (!cache) {
        if (method == 'Self') {
          if (k)
            generated[string] = subject[key] = 
              new Game.Object.Scope(subject, Game.Object[key])
        } else {
           generated[string] = subject[key][method] = 
            new Game.Object.Scope(subject[key], Game.Object.Scope[method])
        }
      } else {
        if (method == 'Self')
          subject[key] = cache;
        else
          subject[key][method] = cache;
      }
    }
}(['Self', 'Value', 'Property'], ['Stats', 'Definitions', 'References', 'Equipment', 'Effects']);

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
  return Game.Object.Property.get(object, 1)
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
      (current = Game.Object.Property.max(object, 'quests')) != prev;
      prev = current)
    Game.Object.Quest(object, current);
}

Game.Object.Quest = Game.Quest;

Game.Object.Action = Game.Action;