// 
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

  [1000][200][3][400.000.00]

  - a fact of type 1000 (e.g. love)
  - with value of 200 (e.g. strong)
  - reference of type 3 (e.g. object reference)
  - to something 400.000.00 (e.g. id of that specific cat)
*/

Game.Value = function(type, value, reference) {
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
Game.Type.prototype.indexOf = Game.Value;
