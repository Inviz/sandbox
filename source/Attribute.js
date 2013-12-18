/* 
  Function to pack a dictionary item, value and a reference 
  into a single 64bit number. It means 16 digits we can 
  use to store data. Data format is the following:

  - 4 first digits for type (kind of effect or entity)
  - 3 for integer -999...999 (power of effect)
    the resulting number will have minus sign, if negative
  - 1 byte for reference type (game data type, area, object)
  - 8 bytes for reference payload (object id, location, shape)
  
  Example: 

  [1000][200][3][40.000.000]

  - a fact of type 1000 (e.g. love)
  - with value of 200 (e.g. strong)
  - reference of type 3 (e.g. object reference)
  - to something 40.000.000 (e.g. id of that specific cat)
*/

Game.Attribute = function(type, value, reference) {
  if (!(type < 10000))
    type = this.typeOf(type)
  if (value === +value) {
    if (value < 0) {
      value = - value;
      var multiplier = -1;
    }
  } else {
    value = 0;
  }
  return (type * 1000000000000 + value * 1000000000 + (reference || 0)) * (multiplier || 1);

}
Game.Type.prototype.indexOf = Game.Attribute;

// parse numerical property into array-compatible object
// value & reference arguments override parsed values  
Game.Property = function(number, value, reference) {
  var result = [];
  if (number._index) {
    var type = number
  } else {
    var multiplier = (number < 0) ? -1 : 1;
    number *= multiplier
    if (number > 9999999) {
      var ref = number % 1000000000;
      number = Math.floor((number - ref) / 1000000000);
      if (reference == null)
        reference = ref;
    }
    if (number > 9999) {
      var val = (number % 1000) * multiplier;
      var type = Math.floor((number - val) / 1000);
      if (value == null)
        value = val;
    } else {
      var type = number
    }
  }
  result.type = result[0] = Game[type];
  if (typeof value == 'number')
    result.value = result[1] = value;
  if (reference) {
    if (typeof reference == 'number')
      reference = Game.Referenced(reference);
    result.reference = result[2] = reference;
  }
  return result;
}
