// 
/* 
  Function to pack a dictionary item, value and a reference 
  into a single 64bit number. It means 16 digits we can 
  use to store data. Data format is the following:

  - 4 first digits for type (kind of effect or entity)
  - 3 for integer 0...999 (power of effect)
  - 1 byte for reference type (reference, polygon, radius)
  - 8 bytes for reference payload (object id, location, shape)
  
  Example: 

  [1000][200][3][400.000.00]

  - a fact of type 1000 (e.g. love)
  - with value of 200 (e.g. strong)
  - reference of type 3 (e.g. object reference)
  - to something 400.000.00 (e.g. id of that specific cat)
*/

Game.Value = function(type, value, r1, r2, r3) {
  if (type !== +type) {
    var result = type._index ? type : this[type];
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
  if (r1 != null) {
    var reference = Game.Reference.Value(r1, r2, r3);
    var digits = Math.floor(Math.log(reference) / Math.LN10) + 1;
    var multiplier = Math.pow(10, digits);
    result = result * multiplier + reference;
  }
  return negate ? - result : result;
}

Game.Type.prototype.indexOf = Game.Value;

// add trailing zeros to a data type id to make it 4 digits
Game.Value.Range = function(type, value, r1, r2, r3) {
  var result = Game.Value(type, value, r1, r2, r3);
  if (result < 10)
    return result * 1000;
  else if (result < 100)
    return result * 100;
  else if (result < 1000)
    return result * 10;
  else
    return result;
}
