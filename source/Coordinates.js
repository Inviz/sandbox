/*
  The game uses fractal coordinate system.
  The world is split into 3x3 grid, with each cell
  numbered from 1 to 9. Then each cell is split into
  3x3 and so on. The final coordinate is a number
  with each digit representing a cell in a grid.

  It's a little harder to deal with these coordinates
  compared to regular (x, y) system:
    - Moving one cell to the north is not a simple matter
      of subtracting 1 from y coordinate.
    - Calculating distances means converting points to (x, y)

  There're advantages too:
    - It's possible to enlarge world by scale factor 9 without
      changing coordinates of existing objects and locations
    - World zoning and sharding is easier, because each coordinate
      has zone information baked in. It is also possible to point
      at a zone at some specific level

  It works good for this stage of development, but it adds some
  undesired overhead, so implementation may change in future.
*/
Game.Coordinates = function(number) {
  if (number.locations)
    return Game.Path.Coordinates(number)
  if (number.push)
    return Game.Object.Coordinates(number)
  return number
}

Game.Coordinates.west = function(number) {
  for (var remainder = number, zoom = 0;; zoom++) {
    var digit = remainder % 10;
    var modifier = Math.pow(10, zoom);
    var row = (digit - 1) % 3;

    if (row > 0) {
      number -= modifier * 1
      break
    } else {
      number += modifier * 2
    }

    if (digit == remainder)
      break;
    remainder = (remainder - digit) / 10;
  } 
  return number;
}

Game.Coordinates.east = function(number) {
  for (var remainder = number, zoom = 0;; zoom++) {
    var digit = remainder % 10;
    var modifier = zoom ? modifier * 10 : 1

    var row = (digit - 1) % 3;
    if (row < 2) {
      number += modifier * 1
      break
    } else {
      number -= modifier * 2
    }

    if (digit == remainder)
      break;
    remainder = (remainder - digit) / 10;
  } 
  return number;
}

Game.Coordinates.north = function(number) {
  for (var remainder = number, zoom = 0;; zoom++) {
    var digit = remainder % 10;
    var modifier = Math.pow(10, zoom);

    var row = Math.floor((digit - 1) / 3);
    if (row > 0) {
      number -= modifier * 3
      break
    } else {
      number += modifier * 6
    }

    if (digit == remainder)
      break;
    remainder = (remainder - digit) / 10;
  } 
  return number;
}

Game.Coordinates.south = function(number) {
  for (var remainder = number, zoom = 0;; zoom++) {
    var digit = remainder % 10;
    var modifier = Math.pow(10, zoom);

    var row = Math.floor((digit - 1) / 3);
    if (row < 2) {
      number += modifier * 3
      break
    } else {
      number -= modifier * 6
    }

    if (digit == remainder)
      break;
    remainder = (remainder - digit) / 10;
  } 
  return number;
}

Game.Coordinates.northwest = function(number) {
  return Game.Coordinates.north(Game.Coordinates.west(number))
}

Game.Coordinates.northeast = function(number) {
  return Game.Coordinates.north(Game.Coordinates.east(number))
}

Game.Coordinates.southwest = function(number) {
  return Game.Coordinates.south(Game.Coordinates.west(number))
}

Game.Coordinates.southeast = function(number) {
  return Game.Coordinates.south(Game.Coordinates.east(number))
}

Game.Coordinates.up = function(number) {
  return Math.floor(number / 10);
};

Game.Coordinates.opposite = function(number, vector) {
  return Game.Coordinates[Game.Coordinates.opposites[vector]](number);
}

Game.Coordinates.Vector = function(from, to) {
  var north = this.north(from)
  var south = this.south(from)
  if (north == to) {
    return 'north'
  } else if (this.east(from) == to) {
    return 'east'
  } else if (south == to) {
    return 'south'
  } else if (this.west(from) == to) {
    return 'west'
  } else if (this.east(north) == to) {
    return 'northeast'
  } else if (this.east(south) == to) {
    return 'southeast'
  } else if (this.west(north) == to) {
    return 'northwest'
  } else if (this.west(south) == to) {
    return 'southwest'
  }
}

// calculate distance between two coordinates
Game.Coordinates.Distance = function(a, b, type) {
  // swap coordinates
  if (b > a) {
    var c = b;
    b = a;
    a = c;
  }

  // normalize coordinates (pad with 5's at the end)
  var max = Math.pow(10, Math.floor((Math.log(a) / Math.LN10) + 1))
  for (;b < max;) {
    c = b * 10 + 5;
    if (c < max) {
      b = c;
    } else {
      break;
    }
  }


  var x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (var zoom = 0;; zoom++) {
    var d1 = a % 10;
    var d2 = b % 10;
    var modifier = Math.pow(3, zoom);

    x1 += modifier * ((d1 - 1) % 3);
    y1 += modifier * Math.floor((d1 - 1) / 3)
    x2 += modifier * ((d2 - 1) % 3);
    y2 += modifier * Math.floor((d2 - 1) / 3)

    if (d1 == a)
      break;
    a = (a - d1) / 10;
    b = (b - d2) / 10
  }
  switch (type) {
    case 'euclidean':
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    case 'manhatten':
      return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    case 'chebyshev': default:
      return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))
  }
}


Game.Coordinates.opposites = {
  'northeast': 'southwest',
  'north': 'south',
  'northwest': 'southeast',
  'west': 'east',
  'southwest': 'northeast',
  'south': 'north',
  'southeast': 'northwest',
  'east': 'west'
}

Game.Coordinates.numbers = [
  'up',
  'northwest',
  'north',
  'northeast',
  'west',
  'center',
  'east',
  'southwest',
  'south',
  'southeast'
];

Game.Coordinates.numbers.forEach(function(value, index) {
  Game.Coordinates[index] = Game.Coordinates[value];
})