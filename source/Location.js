// Location is a single tile or zone
Game.Location = function(value) {
  if (typeof value == 'number')
    return Game.Map.Location(this, value)
  if (value.locations)
    return Game.Path.Location.call(this, value)
  if (value.push)
    return Game.Object.Location.call(this, value)
};

// Return tile coordinates
Game.Location.Coordinates = function(array) {
  return array[0];
};

// Generate all combinations of iterator scopes
Game.Scopes(Game.Location, 
  ['Self', 'Value', 'Attribute'], 
  ['Properties', 'Definitions', 'References', 'Equipment', 'Effects']
);