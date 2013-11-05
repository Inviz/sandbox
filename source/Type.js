// Generates and indexes dinctionaries of game data (../data/*.js)

Game = (function() {

var Type = function(object, index, parent, reference) {
  if (this.merge) {
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
      Storage._length = 1;
  
    switch (typeof object) {
      case 'object': case 'function':
        for (var property in object)
          if (object.hasOwnProperty(property))
          if (this.Type._ignored.indexOf(property) == -1)
            Storage.merge(property, object[property])
          else
            Storage[property] = object[property];
        break;
    }

    return Storage;
  }
};

Type.prototype.toString = function() {
  return this._path;
}

Type.prototype.valueOf = function() {
  return this._index || 0;
}

// returns type of data item (first 4 digits)
Type.prototype.typeOf = function(number) {
  while (number > 9999)
    number /= 10
  return Math.floor(Math.abs(number));
}

// adds dictionary item
Type.prototype.merge = function(key, value, index) {
  if (index == null)
    index = this._index || 0;
  if (this._length == null)
    this._length = 0;
  if (value != null && typeof value == 'object' && !value.push) {
    var i = index * 10 + (this._length++);
    var object = this[key] = new Game.Type(value, i, this, key);
  } else {
    var val = this[key] = value;
  }
  if (this != Game)
    for (var property in this)
      if (this.hasOwnProperty(property)
      && Game.Type._ignored.indexOf(property) == -1
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


Type._ignored = ['_length', '_parent', '_index', '_reference', '_path', 'merge', '_ignored', 'valueOf', 'toString']

Type.prototype.Type = Type;
var Game = new Type
Game.Type = Type
Game.merge('location', {})
Game.merge('path', {})

return Game;

})()

