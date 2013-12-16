// Reference is an interface to serialize links between things
// 1 digit for type, 8 digits for payload

// Create a number that encapsulates a single reference 
Game.Reference = function(type, a, b, raw) {
  var referencer = Game.Reference[type]
  // guess reference type
  if (!referencer) {
    referencer = Game.Reference[typeof type];
    b = a;
    a = type;
  }
  var value = referencer.valueOf(a, b);
  if (raw)
    return value;
  // add reference type
  var digits = Math.floor(Math.log(value) / Math.LN10) + 1;
  var multiplier = Math.pow(10, digits);
  return value + multiplier * referencer._index;
}

// Resolve reference by type (specified in first digit)
Game.Referenced = function(number) {
  var digits = Math.floor(Math.log(number) / Math.LN10) + 1;
  var multiplier = Math.pow(10, digits - 1);
  var type = Math.floor(number / multiplier);
  return Game.Reference[type](number - type * multiplier);
};

// location by coordinates
Game.Reference.location = function(number) {
  return number;
}
Game.Reference.location.valueOf = function(a) {
  return a;
}
Game.Reference.number = Game.Reference.location;
Game.Reference[1] = Game.Reference.location;
Game.Reference[1]._index = 1;


// object by id
Game.Reference.object = function(id) {
  return Game.Object[id];
}
Game.Reference.object.valueOf = function(a) {
  return a.id || Game.Object.ID(a);
}
Game.Reference[2] = Game.Reference.object;
Game.Reference[2]._index = 2;

// data reference (creature, item, property)
Game.Reference.data = function(number) {
  return Game[number];
}
Game.Reference.data.valueOf = function(a) {
  return (Game[a] || a).valueOf();
}
Game.Reference.string = Game.Reference.data;
Game.Reference[3] = Game.Reference.data;
Game.Reference[3]._index = 3;

// area of effect
Game.Reference.area = function(a) {
  return a;
}
Game.Reference.area.valueOf = function(a) {
  return a;
}
Game.Reference[4] = Game.Reference.area;
Game.Reference[4]._index = 4;
