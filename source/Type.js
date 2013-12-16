// Generates and indexes dinctionaries of game data (../data/*.js)

Game = (function() {

var Type = function(object, index, parent, reference) {
  if (index != null) {
    var Storage = function() {
      if (this instanceof Storage)
        return;
      var object = new Game.Object
      var type = Storage.valueOf();
      if (type)
        object.push(type)
      for (var i = 0, j = arguments.length; i < j; i++) {
        var arg = arguments[i];
        if (typeof arg == 'string')
          arg = Game.Value(arg);
        object.push(arg);
      }
      return object;
    };
    for (var property in this.Type.prototype)
      Storage[property] = this.Type.prototype[property];

    this.Type[index] = Storage;
    Storage._index = index;
    if (reference) {
      Storage._parent = parent;
      var path = Storage._reference = reference;
      while (parent) {
        for (var p = parent; p; p = p._parent)
          if (!p[path])
            p[path] = Storage;
        var ref = parent._reference;
        if (ref)
          path = ref + '.' + path;
        if (breaking)
          break
        else if (parent._parent)
          parent = parent._parent
        else
          var breaking = true;
      }
      Storage._path = path
      parent[index] = Storage;
    }
    if (!index)
      Storage.__length = 1;
  
    switch (typeof object) {
      case 'object': case 'function':
        for (var property in object)
          if (object.hasOwnProperty(property))
          if (this._ignored.indexOf(property) == -1)
            Storage.merge(property, object[property])
          else
            Storage[property] = object[property];
        break;
    }

    return Storage;
  } else {
    if (typeof object != 'number') {
      var result = object._index ? object : this[object];
      if (result) result = result._index;
      if (result == null) {
        var context = this;
        // walk composite key
        for (var last = -1, index; index = object.indexOf('.', last + 1); ) {
          var key = object.substring(last + 1, index == -1 ? undefined : index);
          context = context[key];
          if (context == null)
            return 0
          if (index == -1) {
            return context._index;
          } else last = index
        }
      }
      return result;
    } else {
      if (object > 9999) {
        while (object > 9999)
          object /= 10
        return Math.floor(object)
      }
      return object;
    }
  }
};

var Game = Type.prototype;
Game.Type = Type;

Type.prototype.toString = function() {
  return this._path;
}

Type.prototype.valueOf = function() {
  return this._index || 0;
}
Type.prototype.typeOf = Type;

// adds dictionary item
Type.prototype.merge = function(key, value, index) {
  if (index == null)
    index = this._index || 0;
  if (this.__length == null)
    this.__length = 0;
  if (value != null && typeof value == 'object' && !value.push) {
    var i = index * 10 + (this.__length++);
    var object = this[key] = new Game.Type(value, i, this, key);
  } else {
    var val = this[key] = value;
  }
  if (this != Game)
    for (var property in this)
      if (this.hasOwnProperty(property)
      && this._ignored.indexOf(property) == -1
      && key !== property) {
        var v = this[property];
        if (object && v._index == null) {
          if (object[property] == null)
            object.merge(property, v)
        } else if (val !== undefined && val._index == null) {
          v[key] = val;
        }
      }
}

Type.prototype._ignored = ['_length', '_parent', '_index', '_reference', '_path', 'merge', '_ignored', 'valueOf', 'typeOf', 'toString', 'Range', 'Type']


Game.Type.Range = function(type) {
  var result = Game.Type(type);
  if (result < 10)
    return result * 1000;
  else if (result < 100)
    return result * 100;
  else if (result < 1000)
    return result * 10;
  else
    return result;
}

// enchrich type definition with list of inheritable properties.
// should be ran after all definitions are initialized
Game.Type.Properties = function(reference) {
  if (reference._length === undefined) {
    reference._length = 0;
    for (var property in reference) {
      var value = reference[property];
      if (reference._ignored && reference._ignored.indexOf(property) > -1)
        continue;
      var number = Game.Type(property)
      if (number) {
        var definition = Game[number];
        if (definition.inherit) {
          reference[reference._length] = Game.Value(number, reference[property]);
          reference._length++;
        }
      }
    }
  }
  return reference;
}

// add trailing zeros to a data type id to make it 4 digits
// used to query value types (is this thing a `creature`?)


Game = new Type(null, 0);
Game.merge('location', {})
Game.merge('path', {})
return Game;

})()

