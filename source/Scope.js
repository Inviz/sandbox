// composable iterator filters
Game.Scope = function(options, overrides, flat, scope, mutable) {
  if (scope == null)
    if (options.mutator)
      var scope = function(object, type, value, reference, callback, recursive) {
        return Game.Value(object, type, reference, callback, scope, value, recursive)
      }
    else
      var scope = function(object, type, reference, callback, recursive) {
        return Game.Value(object, type, reference, callback, scope, undefined, recursive)
      }
  for (var option in options)
    if (!options[option].scope)
      scope[option] = options[option];
  if (overrides)
    for (var option in overrides) {
      if (!overrides[option].scope && (!Game.Scopes || Game.Scopes[option]))
        scope[option] = overrides[option];
    }
  scope.scope = true;
  if (mutable) {
    scope.set = Game.Scope.set;
    scope.increment = Game.Scope.increment;
    scope.decrement = Game.Scope.decrement;
  }
  if (!options.mutator && !flat) {
    for (var property in Game.Scope) {
      var value = Game.Scope[property];
      if (scope[property] == null && value.scope && !value.mutator) {
        scope[property] = new Game.Scope(value, scope, true);
      }
    }
  }
  return scope; 
};


// Unscoped mutables that 
// modify first attribute with matching type
Game.Scope.set = new Game.Scope({
  mutator: true,
  single: true,
  properties: true,
  reducer: function(result, object, type, reference, arg, i) {
    return object[i] = Game.Attribute(type, arg, reference)
  }
})

Game.Scope.increment = new Game.Scope({
  mutator: true,
  single: true,
  properties: true,
  reducer: function(result, object, type, reference, arg, i, value) {
    return object[i] = Game.Attribute(type, arg + (value || 0), reference);
  }
})

Game.Scope.decrement = new Game.Scope({
  mutator: true,
  single: true,
  properties: true,
  reducer: function(result, object, type, reference, arg, i, value) {
    return object[i] = Game.Attribute(type, arg - (value || 0), reference);
  }
})

// Immutable scopes
Game.Scope.sum = new Game.Scope({
  iterator: function(sum, value) {
    return (sum || 0) + value;
  }
})

Game.Scope.max = new Game.Scope({
  iterator: function(max, value) {
    return Math.max(max || 0, value);
  }
})

Game.Scope.min = new Game.Scope({
  iterator: function(min, value) {
    return Math.min(min || 0, value);
  }
})

// Return value
Game.Scope.Value = new Game.Scope({
  output: true
})

// Return property (type + value + reference)
Game.Scope.Attribute = new Game.Scope({
  output: false
})

// Return first result
Game.Scope.get = new Game.Scope({
  single: true
})

// Return array of results
Game.Scope.each = new Game.Scope({
  iterator: function(result, value, object, type, reference) {
    if (!result)
      result = [];
    if (this.output === false)
      result.push(Game.Attribute(type, value, reference));
    else
      result.push(value)
    return result;
  }
});

Game.Scope.map = Game.Scope.each;
Game.Scope.filter = Game.Scope.each;


// Referenced objects
Game.Scope.References = new Game.Scope({
  references: true
});

// Equipment items
Game.Scope.Equipment = new Game.Scope({
  equipment: true
});

// Actions, spells, auras
Game.Scope.Effects = new Game.Scope({
  effects: true
});

// Own properties
Game.Scope.Properties = new Game.Scope({
  properties: true
});

// Game data definitions
Game.Scope.Definitions = new Game.Scope({
  definitions: true
});

// Extend object with combinations of scopes
Game.Scopes = function(context, methods, scopes) {


  // set own properties, get total value
  context = new Game.Scope(Game.Scopes, null, null, context, true);

  // Get and set value by matching reference
  context.Value = new Game.Scope(
    Game.Scopes, Game.Scope.Value, 
    null, context.Value, true);


  // Return property (value with type and optional reference, internal format)
  context.Attribute = new Game.Scope(
    Game.Scopes, Game.Scope.Attribute, 
    null, context.Attribute, true);

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
      var subject = context;
      for (var k = 0, l = combo.length - 1; k < l; k++)
        subject = subject[combo[k]]
      var key = combo[k];

      var string = combo.sort() + method;
      var cache = generated[string]
      if (!cache) {
        var subj = combo.length == 1 && {};
        if (method == 'Self') {
          generated[string] = subject[key] = 
              new Game.Scope(subj || subject, Game.Scope[key])
        } else {
           generated[string] = subject[key][method] = 
            new Game.Scope(
              subject[key], 
              Game.Scope[method])
        }
      } else {
        if (method == 'Self')
          subject[key] = cache;
        else
          subject[key][method] = cache;
      }
    }

  return context;
};

// default config for methods added by Game.Scopes()
Game.Scopes.equipment = 
Game.Scopes.references = 
Game.Scopes.effects = 
Game.Scopes.definitions = 
Game.Scopes.properties =  
Game.Scopes.output = true
