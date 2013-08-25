// Generates and indexes dinctionaries of game data (../data/*)

var Data = function(object, index, parent, reference) {
  if (this instanceof Data) {
    var Storage = function() {
      if (this instanceof Storage)
        return;
      var object = Game.Object()
      var type = Storage.valueOf();
      if (type)
        object.push(type)
      for (var i = 0, j = arguments.length; i < j; i++) {
        var arg = arguments[i];
        if (typeof arg == 'string')
          arg = Game.valueOf(arg);
        object.push(arg);
      }
      return object;
    };
    for (var property in Data.prototype)
      Storage[property] = Data.prototype[property];

    Data[index] = Storage;
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
      parent[index] = Storage;
    }
    if (!index)
      Storage._length = 1;
  
    switch (typeof object) {
      case 'object': case 'function':
        for (var property in object)
          if (object.hasOwnProperty(property))
          if (Data._ignored.indexOf(property) == -1)
            Storage.merge(property, object[property])
          else
            Storage[property] = object[property];
        break;
    }

    return Storage;
  }
};

Data.prototype.toString = function() {
  return this._reference;
}

// packs a dictionary item into a 64bit number
Data.prototype.valueOf = function(type, value, reference, ref1, ref2) {
  // convert string key to number
  if (type == null)
    return this._index || 0;

  if (type !== +type) {
    var result = this[type];
    if (result) result = result._index;
    if (result == null) {
      var object = this;
      // walk composite key
      for (var last = -1, index; index = type.indexOf('.', last + 1); ) {
        var key = type.substring(last + 1, index == -1 ? undefined : index);
        object = object[key];
        if (object == null)
          return 0
        if (index == -1) {
          result = object._index;
          break;
        } else last = index
      }
    }
  } else {
    if (type > 9999) {
      while (type > 9999999)
        type /= 10
      type = Math.floor(type)
      return type - Math.floor(type / 100) * 100
    }
    var result = type;
  }
  // pack value
  if (value === +value) {
    if (result < 100)
      result *= 100
    if (value < 0) {
      value = - value;
      var negate = true;
    }
    result = result * 1000 + value;
  }
  // pack and parse reference
  if (reference != null) {
    if (typeof reference != 'number') {
      if (ref1 == null) {
        ref1 = reference
        reference = Reference.data
      } else {
        reference = Reference[reference];
      }
    }
    var ref = Reference(reference, ref1, ref2)
    var digits = Math.floor(Math.log(ref) / Math.LN10) + 1;
    var multiplier = Math.pow(10, digits);
    result = result * multiplier * 10 + reference * multiplier + ref
  }
  return negate ? - result : result
}

// returns type of data item (first 4 digits)
Data.prototype.typeOf = function(number) {
  while (number > 9999)
    number /= 10
  return Math.floor(Math.abs(number));
}

// adds dictionary item
Data.prototype.merge = function(key, value, index) {
  if (index == null)
    index = this._index || 0;
  if (this._length == null)
    this._length = 0;
  if (value != null && typeof value == 'object' && !value.push) {
    var i = index * 10 + (this._length++);
    var object = this[key] = new Data(value, i, this, key);
  } else {
    var val = this[key] = value;
  }
  for (var property in this)
    if (this.hasOwnProperty(property)
    && Data._ignored.indexOf(property) == -1
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

Data._ignored = ['_length', '_parent', '_index', '_reference', '_path', 'merge', '_ignored', 'valueOf', 'toString']

// Interface to create a reference of specified type
Reference = function(type, a, b) {
  return Reference[type](a, b)
}

// location by coordinates
Reference['location'] = 1;
Reference[1] = function(a) {
  return a;
}

// object by id
Reference['object'] = 2;
Reference[2] = function(a, b) {
  if (a.id)
    return a.id;
  var id = Game.Object.get(a, 'id');
  if (id == null) {
    id = Game.Object.getID()
    Game.Object[id] = a;
    Game.Object.set(a, 'id', id);
  }
  return id;
}

// general reference (creature, item, property)
Reference['data'] = 3;
Reference[3] = function(a) {
  if (typeof a == 'string')
    a = Game[a];
  return a.valueOf();
}

// area of effect
Reference['area'] = 4;
Reference[4] = function() {

}

// Game global variable is data instance
var Game = new Data
// first two digits are reserved for absolute & local coordinates
// so data entries start at 3
Game._length = 2;
Game.Data = Data;
Game.Reference = Reference;