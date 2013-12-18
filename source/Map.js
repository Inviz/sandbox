// Game.Map: Creates a map of 9^width squares aligned to grid
//
// * If width is 1, it creates a 3x3 matrix of 9^4 maps (viewport map)
//   Viewport maps are not aligned to grid (allow free scrolling)
// * Maps of different scale can be nested via viewport map 
//   Each of 9 maps in viewport represent a single tile in another map
Game.Map = function(width, scrolling) {
  if (!(this instanceof Game.Map))
    return
  if (width == null)
    return;
  var map = function(number, object) {
    var tile = map.tileAt(number);
    if (object !== undefined)
      map.put(tile, object)
    return tile;
  }
  map.width = width;
  map.max = Math.pow(10, width)
  if (scrolling)
    var array = {};
  else
    var array = Array(map.max);
  map.array = array;
  map.objects = [];
  if (scrolling)
    map.scrolling = true

  if (!Game.Map.indexOfs)
    Game.Map.indexOfs = {};
  map.indexOfs = (Game.Map.indexOfs[width] || (Game.Map.indexOfs[width] = {}));

  for (var property in this)
    map[property] = this[property];
  return map;
};

// return tile at location
Game.Map.prototype.tileAt = function(number, lazy) {
  var array = this.array;
  if (this.scrolling) {
    var width = this.width;
    var digits = Math.floor(Math.log(number) / Math.LN10) + 1;
    var divisor = Math.pow(10, Math.min(width, digits - this.z));
    var zone = Math.floor(number / divisor);
    var remainder = number - zone * divisor;
    var zoned = array[zone];
    if (remainder) {
      if (zoned)
        return zoned.tileAt(remainder);
    }
    return zoned;
  }
  if (number > this.max) {
    var z = this.z || 1;
    var digits = Math.floor(Math.log(number) / Math.LN10) + 1;
    var divisor = Math.pow(10, Math.max(0, digits - z));
    var remainder = Math.floor(number / divisor);
    if (remainder == this.zone || !this.zone) {
      var coordinates = number - remainder * divisor;
      digits = digits - z - this.width
      var divisor = Math.pow(10, Math.max(0, digits));
      if (digits > 0)
        var local = number;
      coordinates = Math.floor(coordinates / divisor);
    } else {
      //console.error('prefix mismatch', number, remainder, this.zone)
      return;
    }
  }


  var tile = array[coordinates || number];
  if (local) {
    if (this.viewport)
      tile = this.viewport(local)
  } else {
    if (!lazy && !tile) {
      tile = array[coordinates || number] = [
        Game.Map.Coordinates(this, parseInt(number), digits)
      ]
    }
  }
  return tile;
}

// move object from one tile to another
Game.Map.prototype.move = function(from, to, object) {
  if (typeof to == 'string')
    to = this[to](from);
  else
    // remove first step from path 
    to = Game.Path.pop(to);
  from = Game.Map.Location(this, from);
  this.delete(from, object, true);
  this.put(to, object, true);
  var vector = Game.Coordinates.Vector(from[0], to[0]);
  Game.Object.Vector(object, vector)
  return to;
}

// remove object from a tile
Game.Map.prototype.delete = function(tile, object, lazy) {
  if (typeof tile == 'number')
    tile = this(tile)
  var occupation = Game.Attribute('occupy', 0, 'object', object);
  tile.splice(tile.indexOf(occupation), 1);
  object.splice(object.indexOf(tile[0]), 1);
  if (!lazy)
    this.objects.splice(this.objects.indexOf(object), 1);
  var resources = Game.resources._index * 1000;
  // parse each property in object
  for (var i = 0, j = object.length; i < j; i++) {
    var prop = object[i];
    var negate = prop < 0;
    if (negate)
      prop = - prop;
    var digits = Math.floor(Math.log(prop) / Math.LN10) + 1;
    var divisor = Math.pow(10, digits - 4);
    var kind = Math.floor(prop / divisor);
    // propagate resources
    if (kind >= resources && kind <= resources + 1000) {
      var val = prop - kind * divisor;
      if (negate)
        val = - val;
      var start = tile[0];
      var world = this.world || this;
      for (var parent = start; parent; parent = Game.Coordinates.up(parent)) {
        if (world.zone == parent)
          break;
        var tile = world(parent);
        if (tile)
          Game.Object.increment(tile, kind, - val)
      }
    }
  }
};

// place object in the tile
Game.Map.prototype.put = function(tile, object, lazy) {
  if (typeof tile == 'number')
    tile = this(tile)
  tile.push(Game.Attribute('occupy', 0, 'object', object));
  object.push(tile[0]);
  if (!lazy)
    this.objects.push(object);
  Game.Object.Map(object, this);
  if (this.callback)
    this.callback.call(this, tile, object, number, position);
  var resources = Game.resources._index * 1000;
  // parse each property in object
  for (var i = 0, j = object.length; i < j; i++) {
    var prop = object[i];
    var negate = prop < 0;
    if (negate)
      prop = - prop;
    var digits = Math.floor(Math.log(prop) / Math.LN10) + 1;
    var divisor = Math.pow(10, digits - 4);
    var kind = Math.floor(prop / divisor);
    // propagate resources
    if (kind >= resources && kind <= resources + 1000) {
      var val = prop - kind * divisor;
      if (negate)
        val = - val;
      var start = tile[0];
      var world = this.world || this;
      for (var parent = start; parent; parent = Game.Coordinates.up(parent)) {
        if (world.zone == parent)
          break;
        var tile = world(parent);
        if (tile)
          Game.Object.increment(tile, kind, val)
      }
    }
  }
}

// order of neighbhours to be visited
Game.Map.prototype.directions = ['north', 'east', 'south', 'west', 'northwest', 'northeast', 'southeast', 'southwest']

// pattern to walk around the node
Game.Map.prototype.shifts = ['north', 'east', 'south', 'south', 'west', 'west', 'north', 'north'];

var z = 0;

// walk around the map
// can break & resume its computations
Game.Map.prototype.walk = function(start, callback, max, meta, vector, output) {
  if (!output)
    output = new Game.Path(this)
  var result = output.result;
  var queues = output.queues;
  var locations = output.locations;
  var distances = output.distances;
  var qualities = output.qualities;
  var backtrace = output.backtrace;
  var processed = output.processed;

  if (typeof start == 'number')
    start = this(start)
  if (!max)
    max = 3
  var directions = this.directions;

  var pos = locations.indexOf(start[0]);
  if (pos == -1) {
    pos = locations.length;
    var distance = 0;
  } else {
    var distance = distances[pos]
  }

  locations[pos] = start[0];
  distances[pos] = distance;
  qualities[pos] = 0;
  backtrace[pos] = locations[pos - 1];
  processed[pos] = 0;

  var levels = typeof meta == 'number';
  var index = (levels ? meta : 0) * 2
  var queue = (queues[index] || (queues[index] = []))
  var weights = (queues[index + 1] || (queues[index + 1] = []))

  // when shifting a shape, replace perimeter with another
  if (vector && levels) {
    var shifted = [];
    var queued = queue.slice()
    queues[index] = shifted
  } else {
    var queued = queue
  }

  queue: for (var node = start; node; node = queue[queue.length - 1]) {

      z++;

    var pos = locations.indexOf(node[0])
    processed[pos] = 1;
    distance = distances[pos] + 1;


    if (distance > max + 1 && !vector) {
      next = node
      break;
    }

    if (vector && levels) {
      var boundary = !this(Game.Coordinates.opposite(node[0], vector))
      //if (boundary) console.error('sjfnskjgnkjn', node[0])
    }

    if (node !== start || queue[queue.length - 1] === start) {
      queue.pop()
      weights.pop()
    }

    // add node's neighbours to queue
    // only adds ones specified by vector, when given
    for (var d = 0, direction; direction = directions[d++];) {
      if (levels && vector && result.length) {
        if (vec) {
          vec = null;
          break;
        } else {
          var vec = vector
          var direction = vector;
        }
      }

      var next    = this(Game.Coordinates[direction](node[0]));
      if (!next) continue;

      if ((queued.indexOf(next) == -1 && next != start) || vector) {
        var pos = locations.indexOf(next[0])
        if (pos == -1)
          pos = locations.length;
        if (!processed[pos] ||  distances[pos] > distance || next == start || vector) {

          var quality = callback.call(this, next, distance, meta, output);
          
          // register node as visited, store computed values
          if (distances[pos] == null || distances[pos] > distance) {
            locations[pos] = next[0]
            distances[pos] = distance;
            backtrace[pos] = node[0];
          }
          qualities[pos] = quality;
          if (processed[pos] == null)
            processed[pos] = 0;

          // check callback return value
          switch (typeof quality) {
            case 'number':
              if (quality == -Infinity)
                break queue;
              if (quality == Infinity)
                continue queue;
              break;
            case 'boolean':
              return quality;
              break;
            case 'object': 
              var ret = quality;
              break queue;
            default:
              var quality = 0;
          }

          // add node to queue, preserve quality sort order
          if (!levels) {
            var weight = quality + distance;
            for (var k = queue.length, n; n = queue[k - 1]; k--)
              if (weights[k - 1] > weight)
                break;
            weights.splice(k, 0, weight)
            queue.splice(k, 0, next)
          } else {
            (shifted || queue).unshift(next)
          }
        }
      }
    }
  }

  // backtrace result
  if (!levels && !ret) {
    var started = !result.length
    if (started) {
      //result.push(next);
    } else {
      var j = 0;
      var pos = locations.indexOf(next[0]);
      if (pos > -1) {
        if (qualities[pos] == -Infinity)
          result.splice(j++, 0, next)
      }
      var reuse = true;
    }
    output.queues = [];
    output.processed.length = 0;
    output.processed.length = output.locations.length;
    for (var i = 0, now = next; i < distance; i++) {
      var old = locations.indexOf(now[0]);
      if (old > -1) {
        var p = backtrace[old];
        output.processed[locations.indexOf(p)] = 1
        if (p) {
          var prev = this(p);
          if (prev) {
            if (prev == start || result.indexOf(prev) > -1)
              break;
            if (reuse) {
              result.splice(j++, 0, prev);
            } else {
              result.push(prev)
            }
          }
        }
      }
      now = p && prev;
    }
  }
  return output;
};

// calculate tile position in 1d base10 array 
Game.Map.prototype.indexOf = function(number) {
  var right = number % this.max;
  var cache = this.indexOfs[right];
  if (cache != null)
    return cache;
  var width = this.width;
  var x = 0, y = 0, w = 1;
  for (var remainder = number, zoom = 0;
       zoom != width; 
       zoom++) {
    var digit = remainder % 10;
    var modifier = Math.pow(3, zoom);

    x += modifier * ((digit - 1) % 3);
    y += modifier * Math.floor((digit - 1) / 3)
    w *= 3

    if (digit == remainder)
      break;
    remainder = (remainder - digit) / 10;
  }
  if (zoom + 1 < width) {
    var position = 0;
    for (var i = 0; i < width - zoom - 1; i++)
      position += Math.pow(9, width - i)
    return position + x + y * w;
  }
  var result = x + y * w
  this.indexOfs[right] = result;
  return result;
}

// set zone in the central square of 9 sq. viewport world
Game.Map.prototype.setZone = function(number, callback) {
  this.z = Math.floor((Math.log(number) / Math.LN10) + 1);
  this.world = callback;
  if (this.scrolling) {
    this.zoned = number;
    var array = this.array;
    var first
    var unused = []
    for (var index in array) {
      if (!first)
        first = array[index];
      unused.push(array[index])
    }
    if (first && first.zone) {
      var unset = []
      var result = {};
      this.each(function(position, tile) {
        for (var i = 0; i < unused.length; i++)
          if (unused[i].zone == position) {
            result[position] = unused[i];
            unused.splice(i, 1);
            return;
          }
        unset.push(position);
      }, this, true)
      for (var i = 0, zone; zone = unset[i++];) {
        var z = unused.pop()
        result[zone] = z;
        for (var j = 0; j < z.array.length; j++)
          if (z.array[j])
            z.array[j].length = 1;
        z.setZone(zone, callback);
      }
      this.array = result;
    } else {
      this.each(function(position, tile) {
        tile = this.array[position] = new Game.Map(this.width);
        tile.viewport = this;
        tile.objects = map.objects;
        tile.setZone(position, callback)
      }, this, true)
    }
  } else {
    this.zone = number;
    this.each(function(position, tile) {
      if (tile)
        tile[0] = Game.Map.Coordinates(this, position);
      /*if (callback)
        callback.call(this, position, tile)
        */
    }, this)
  }
}

// iterate tiles in 2d order (scan lines)
Game.Map.prototype.each = function(callback, bind, lazy) {
  if (this.scrolling) {
    var prefix = 0;
    var start = Game.Coordinates.northwest(this.zoned);
    var width = 1
  } else {
    var prefix = this.zone * Math.pow(10, this.width);
    var start = 0;
    for (var i = 0; i < this.width; i++)
      start += Math.pow(10, i);
    var width = this.width;
  }
  var width = Math.pow(9, width / 2)
  var now = start;
  for (var i = 0; i < width; i++) {
    var prev = now;
    for (var j = 0; j < width; j++) {
      callback.call(bind || this, 
        prefix + now, 
        this.array[now], 
        now,
        i * width + j)
      now = Game.Coordinates.east(now) 
    }
    now = Game.Coordinates.south(prev)
  }
};

// visualize state of the map
Game.Map.prototype.draw = function(object) {
  if (object) {
    var id       = Game.Object.ID(object);
    var world    = Game.Object.Map(id)
    var navigate = Game.Object.Output(id, 'walk')
    var locate   = Game.Object.Output(id, 'look')
    var queue    = []//locate.queues;
    var goals    = []//locate.result;
    var path     = []//navigate.result;
    var q        = [];
    var g        = []
    var modifier = 0;
    for (var k = 0;; k++) {
      var current = queue[k * 2];
      if (!current)
        break;
      if (goals[k]) {
        var index = goals[k][0] * Math.pow(10, k) + modifier;
        g.push(index)
        this(index)
      }
      for (var l = 0, el; el = current[l++];) {
        var index = el[0] * Math.pow(10, k) + modifier;
        this(index)
        q.push(index)
      }
      modifier = modifier * 10 + 5
    }
  }

  var param = (location.search.match(/p=(\d+)/) || [0, null])[1]
  if (param) param = this(param)
    
  var index = 0;
  for (var property in this.array) {
    if (!this.scrolling)
      var map = this;
    else
      var map = this.array[property];
    if (!canvas) {
      var canvas = this.canvas;
      var context = canvas.getContext('2d')
      var width = Math.pow(3, map.width)
      var size = this.scrolling ? width * 3 : width;
      var pic = context.createImageData(size, size);
      var data = pic.data;

      // draw borders in big map
      if (this.scrolling) {
        for (var i = 0; i < 2; i++) {
          for (var j = 0; j < width * 3; j++) {
            if (j % 3 == 0) {
              var pos = ((width * (i + 1)) + width * j * 3) * 4
              data[pos] = 
              data[pos + 1] = 
              data[pos + 2] = 230
              data[pos + 3] = 255
            }
          }
        }
        for (var i = 0; i < 2; i++) {
          for (var j = 0; j < width * 3; j++) {
            if (j % 3 == 0) {
              var pos = (j + width * (i + 1) * 3 * width) * 4
              data[pos] = 
              data[pos + 1] = 
              data[pos + 2] = 230
              data[pos + 3] = 255
            }
          }
        }
      }
    }

    if (this.scrolling) {
      var mX = (index % 3) * width
      var mY = Math.floor(index / 3) * width
    }
    var that = this;
    map.each(function(position, tile, loc, i) {
      if (!tile)
        return;
      if (that.scrolling) {
        var x = i % width ;
        var y = Math.floor(i / width);
        var pos = ((y + mY) * width * 3 + (x + mX)) * 4;
      } else {
        var pos = i * 4;
      }

      Game.Object.References(tile, 0, function(object, type) {
        Game.Object.Types(object, function(definition, type) {
          switch (definition._reference) {
            case 'table':
              data[pos] = 200;
              data[pos + 1] = 50;
              data[pos + 2] = 50;
              data[pos + 3] = 255;
              break;
            case 'human': case 'rabbit':
              data[pos + 2] = 255;
              data[pos + 3] = 255;
              break;
            case 'strawberry': case 'bed':
              data[pos + 1] = 255;
              data[pos + 3] = 255;
              break; 
            default:
          }
        })
      })
      if (!data[pos + 3]) {
        if (path && path.indexOf(tile) > -1) {
          data[pos] =
          data[pos + 1] =
          data[pos + 2] = 128
          data[pos + 3] = 255;
        } else if (g && g.indexOf(tile[0]) > -1) {
          data[pos] =
          data[pos + 0] =
          data[pos + 3] = 255;
        } else if (q && q.indexOf(tile[0]) > -1) {
          data[pos] =
          data[pos + 1] =
          data[pos + 2] = 230
          data[pos + 3] = 255;
        }
      }
      if (param && param == tile) {
        data[pos + 1] = 170 
        data[pos + 3] = data[pos + 3] || 255;
      }
    });

    if (!this.scrolling)
      break;
    index++
  }
  var pattern = this.pattern
  if (!pattern) {
    var pattern = this.pattern = canvas;
    var kanvas = document.createElement('canvas');
    var zoom = this.scale || 2;
    kanvas.width = pattern.width * zoom
    kanvas.height = pattern.height * zoom
    var kontext = kanvas.getContext('2d');
    kontext.webkitImageSmoothingEnabled = 
    kontext.mozImageSmoothingEnabled = false;
    if (pattern.parentNode)
      pattern.parentNode.replaceChild(pattern, kontext);
    canvas = kanvas
    context = kontext
    this.canvas = kanvas
  }
  pattern.getContext('2d').putImageData(pic, 0, 0)

  context.scale(zoom, zoom)
  context.clearRect(0, 0, pattern.width, pattern.height);
  context.fillStyle = context.createPattern(pattern, 'repeat');
  context.fillRect(0, 0, pattern.width, pattern.height);

  if (this.scrolling) {
    context.fillStyle = "#dddddd"
    context.font = "bold 7px sans-serif";

    var i = 0;
    for (var property in this.array) {
      if (i == 4)
        continue
      var mX = (i % 3) * width
      var mY = Math.floor(i / 3) * width
      if (i % 3 == 0)
        mX += 10
      if (i % 3 == 1)
        mX += width / 2
      if (i % 3 == 2)
        mX += width - 15
      if (Math.floor(i / 3) == 0)
        mY += 10
      if (Math.floor(i / 3) == 1)
        mY += width / 2
      if (Math.floor(i / 3) == 2)
        mY += width - 15
      context.fillText(this.array[property].zone % 1000, mX, mY)
      i++;
    }
  }
}


Game.Map.Location = function(map, object) {
  if (typeof object == 'number')
    var coordinates = object;
  else if (object.locations)
    var coordinates = Game.Path.Coordinates(object);
  else
    var coordinates = Game.Object.Coordinates(object);
  return map.tileAt(coordinates)
}

// convert to absolute coordinate (zone & loc prefix)
Game.Map.Coordinates = function(map, number, digits) {
  if (digits == null)
    var digits = Math.floor(Math.log(number) / Math.LN10) + 1;
  var modifier = Math.pow(10, Math.min(map.width, digits));
  var absolute = modifier * Math.pow(10, map.z || 0)
  if (number < map.max) {
    var zone = map.zone || 0
    if (zone)
      number += modifier * zone;
    else
      number += modifier * Math.pow(10, (map.z || 0))
  } else if (number < modifier * 10) {
    number -= modifier

    var zone = map.zone || 0
    if (zone)
      number += modifier * zone;
    number += modifier * Math.pow(10, (map.z || 0))
  }
  return number;
}