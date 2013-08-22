// Game.Map: Creates a map of 9^width squares aligned to grid
//
// * If width is 1, it creates a 3x3 matrix of 9^4 maps (viewport map)
//   Viewport maps are not aligned to grid (allow free scrolling)
// * Maps of different scale can be nested via viewport map 
//   Each of 9 maps in viewport represent a single tile in another map
Map = function(width) {
    if (width == null)
      return;
  if (this instanceof Map) {
    var map = function(number, object) {
      var tile = map.tileAt(number);
      if (object !== undefined)
        map.put(tile, object)
      return tile;
    }
    var array = Array(Math.pow(9, width));
    map.width = width;
    map.max = Math.pow(10, width)
    map.array = array;
    map.objects = [];
    if (!Game.paths)
      Game.paths = {};
    if (!Game.visiteds)
      Game.visiteds = {};
    if (!Game.maps)
      Game.maps = {};
    map.maps = Game.maps;
    if (!Map.indexOfs)
      Map.indexOfs = {};
    if (!Game.queues)
      Game.queues = {};
    if (!Game.vectors)
      Game.vectors = {};
    map.indexOfs = (Map.indexOfs[width] || (Map.indexOfs[width] = {}));
    if (width == 1) {
      for (var i = 0; i < 9; i++) {
          map.array[i] = new Map(4);
          map.array[i].viewport = this;
          map.array[i].objects = map.objects;
          map.array[i].maps = Game.maps;
      }
    }
    for (var property in this)
      map[property] = this[property];
    return map;
  }
};

Map.prototype.tileAt = function(number, lazy) {
  var array = this.array;
  if (this.width == 1) {
    var first = this.array[0];
    var width = first.width;
    var digits = Math.floor(Math.log(number) / Math.LN10) + 1;
    var divider = Math.pow(10, Math.min(width, digits - this.z));
    var zone = Math.floor(number / divider);
    var remainder = number - zone * divider;
    for (var i = 0; i < array.length; i++) {
      if (array[i].zone == zone) 
        return array[i].call(array[i], remainder)
    }
    return;
  }
  if (number > this.max) {
    var z = this.z || 1;
    var digits = Math.floor(Math.log(number) / Math.LN10) + 1;
    var divider = Math.pow(10, Math.max(0, digits - z));
    var remainder = Math.floor(number / divider);
    if (remainder == this.zone || !this.zone) {
      var coordinates = number - remainder * divider;
      digits = digits - z - this.width
      var divider = Math.pow(10, Math.max(0, digits));
      if (digits > 0)
        var local = number;
      coordinates = Math.floor(coordinates / divider);
    } else {
      //console.error('prefix mismatch', number, remainder, this.zone)
      return;
    }
  }

  var position = this.indexOf(coordinates || number);
  var tile = array[position];
  if (local) {
    if (this.viewport)
      tile = this.viewport(local)
  } else {
    if (!lazy && !tile) {
      tile = array[position] = [
        this.normalize(number, digits)
      ]
    }
  }
  return tile;
}

Map.prototype.move = function(tile, object, from) {
  this.delete(from, object, true);
  this.put(tile, object, true);
}

Map.prototype.delete = function(tile, object, lazy) {
  var occupation = Game.valueOf('occupy', 0, 'object', object);
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
      for (var parent = start; parent; parent = this.up(parent)) {
        if (world.zone == parent)
          break;
        var tile = world(parent);
        if (tile)
          Game.Object.increment(tile, kind, - val)
      }
    }
  }
};

Map.prototype.put = function(tile, object, lazy) {
  tile.push(Game.valueOf('occupy', 0, 'object', object));
  object.push(tile[0]);
  if (!lazy)
    this.objects.push(object);
  if (this.maps)
    this.maps[Game.Object.get(object, 'id')] = this;
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
      for (var parent = start; parent; parent = this.up(parent)) {
        if (world.zone == parent)
          break;
        var tile = world(parent);
        if (tile)
          Game.Object.increment(tile, kind, val)
      }
    }
  }
}

// convert to absolute coordinate (zone & loc prefix)
Map.prototype.normalize = function(number, digits) {
  if (digits == null)
    var digits = Math.floor(Math.log(number) / Math.LN10) + 1;
  var modifier = Math.pow(10, Math.min(this.width, digits));
  var absolute = modifier * Math.pow(10, this.z || 0)
  if (number < this.max) {
    var zone = this.zone || 0
    if (zone)
      number += modifier * zone;
    else
      number += modifier * Math.pow(10, (this.z || 0))
  } else if (number < modifier * 10) {
    number -= modifier

    var zone = this.zone || 0
    if (zone)
      number += modifier * zone;
    number += modifier * Math.pow(10, (this.z || 0))
  }
  return number;
}


Map.prototype.directions = ['north', 'east', 'south', 'west', 'northwest', 'northeast', 'southeast', 'southwest']
var z = 0;
// walk around the map
Map.prototype.walk = function(start, callback, visited, path, queue, max, meta, vector) {
  if (!visited)
    visited = [];
  if (!path)
    path = [];
  if (!queue)
    queue = [];
  if (typeof start == 'number')
    start = this(start)
  if (!max)
    max = 3
  var directions = this.directions;
  for (var pos = -1; (pos = visited.indexOf(start[0], pos + 1)) != -1;)
    if (pos % 5 == 0)
      break;
  if (pos == -1) {
    pos = visited.length;
    var distance = 0;
  } else {
    var distance = visited[pos + 1]
  }
  visited[pos + 0] = start[0];
  visited[pos + 1] = distance;
  visited[pos + 2] = 0;
  visited[pos + 3] = visited[pos - 5];
  var position = 0;
  var levels = typeof meta == 'number';
  var skip = 0;


  if (levels && magnitude == null) {
    var magnitude = 1;
    while (magnitude * 10 < start[0])
      magnitude *= 10
  }

  if (levels && queue.length && vector) {
    // prepare queue for shift
    var collection = [];
    for (var i = 0, j = 0, node; node = queue[i]; i++) {
      if (node[0] < magnitude || node[0] > magnitude * 10) {
        if (j)
          queue[i - j] = node;
      } else {
        collection.push(node);
        var opposite = this(this.opposite(node[0], vector))
        if (opposite)
          j++;
        else
          queue[i - j] = node;
      }
    }
    if (j)
      queue.length -= j;
  } else {
    var collection = queue;
  }

  var length = collection.length;
  queue: for (var node = start; node; node = collection[--length - skip]) {
    // filter out queued nodes from different level
    if (levels) {
      if (node[0] < magnitude || node[0] > magnitude * 10) {
        skip++;
        continue
      }
    }

    for (var pos = -1; (pos = visited.indexOf(node[0], pos + 1)) != -1;)
      if (pos % 5 == 0)
        break;
    
    visited[pos + 4] = 1;
    distance = visited[pos + 1] + 1;



    if (distance > max && !vector) {
      next = collection[collection.length - 1 - skip]
      break;
    } else {
      if (node !== start) {
        if (!skip)
          collection.pop()
        else
          collection.splice(length - skip, 1)
      }

      // add node's neighbours to queue
      for (var d = 0, direction; direction = directions[d++];) {

        if (levels && vector && path.length) {
          if (vec) {
            vec = null;
            break;
          } else {
            var vec = vector
            var direction = vector;
          }
        }
        z++;
        var next    = this(this[direction](node[0]));
        if (!next) continue;


        if ((collection.indexOf(next) == -1 && next != start) || vector) {
          for (var pos = -1; (pos = visited.indexOf(next[0], pos + 1)) != -1;)
            if (pos % 5 == 0)
              break;
          if (pos == -1)
            pos = visited.length;
          if (!visited[pos + 4] ||  visited[pos + 1] > distance || next == start || vector) {

            var quality = callback.call(this, next, distance, visited, path, queue, meta);
            
            // register node as visited, store computed values
            visited[pos]     = next[0]
            visited[pos + 1] = distance;
            visited[pos + 2] = quality;
            visited[pos + 3] = node[0];
            if (!visited[pos + 4])
              visited[pos + 4] = 0;

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
                var result = quality;
                break queue;
              default:
                var quality = 0;
            }

            // add node to queue, preserve quality sort order
            for (var k = queue.length, n; n = queue[k - 1]; k--) {
              for (var old = -1; (old = visited.indexOf(n[0], old + 1)) != -1;)
                if (old % 5 == 0)
                  break;
              if (magnitude == null || (visited[old] > magnitude && visited[old] < magnitude * 10))
              if ((visited[old + 1] + visited[old + 2]) > (quality + distance))
                break;
            }
            queue.splice(k, 0, next)
            if (queue == collection)
              length++;
          }
        }
      }
    }
  }

  // backtrace path
  if (!levels && !result) {
    if (!path.length) {
      path.push(next);
    } else
      var reuse = true;
    var j = 0;
    for (var i = 0, now = next; i < distance; i++) {
      for (var old = -1; (old = visited.indexOf(now[0], old + 1)) != -1;)
        if (old % 5 == 0)
          break;
      if (old > -1) {
        var p = visited[old + 3];
        if (p) {
          var prev = this(p);
          if (prev) {
            if (path.indexOf(prev) > -1)
              break;
            if (reuse) {
              path.splice(j++, 0, prev);
            } else {
              path.push(prev)
            }
          }
        }
      }
      now = p && prev;
    }
  }
  return result == null ? path : result;
};

// calculate tole position in 1d array 
Map.prototype.indexOf = function(number) {
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

// calculate distance between two coordinates
Map.prototype.distance = function(a, b, type) {
  if (this.width == 1)
    return this.array[0].distance(a, b, type);

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

Map.prototype.up = function(number) {
  return Math.floor(number / 10);
};

Map.prototype.opposite = function(number, vector) {
  return this[this.opposites[vector]](number);
}

Map.prototype.opposites = {
  'northeast': 'southwest',
  'north': 'south',
  'northwest': 'southeast',
  'west': 'east',
  'southwest': 'northeast',
  'south': 'north',
  'southeast': 'northwest',
  'east': 'west'
}


Map.prototype.west = function(number) {
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
Map[4] = Map.prototype.west;

Map.prototype.east = function(number) {
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
Map[6] = Map.prototype.east;



Map.prototype.north = function(number) {
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
Map[2] = Map.prototype.north;


Map.prototype.northwest = function(number) {
  return this.north(this.west(number))
}
Map[1] = Map.prototype.northwest

Map.prototype.northeast = function(number) {
  return this.north(this.east(number))
}
Map[3] = Map.prototype.northeast

Map.prototype.southwest = function(number) {
  return this.south(this.west(number))
}
Map[7] = Map.prototype.southwest

Map.prototype.southeast = function(number) {
  return this.south(this.east(number))
}
Map[9] = Map.prototype.southeast


Map.prototype.south = function(number) {
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
Map[8] = Map.prototype.south;

// set zone in the central square of 9 sq. viewport world
Map.prototype.setZone = function(number, callback) {
  this.z = Math.floor((Math.log(number) / Math.LN10) + 1);
  this.world = callback;
  if (this.width === 1) {
    this.zoned = number;
    var array = this.array;
    if (array[0].zone) {
      var unused = this.array.slice();
      var unset = []
      this.each(function(position, tile, index) {
        for (var i = 0; i < unused.length; i++)
          if (unused[i].zone == position) {
            array[index] = unused[i];
            unused.splice(i, 1);
            return;
          }
        unset.push([position, index]);
      }, this, true)
      for (var i = 0, zone; zone = unset[i++];) {
        var z = unused.pop()
        array[zone[1]] = z;
        for (var j = 0; j < z.array.length; j++)
          if (z.array[j])
            z.array[j].length = 1;
        z.setZone(zone[0], callback);
      }
    } else {
      this.each(function(position, tile) {
        tile.setZone(position, callback)
      })
    }
  } else {
    this.zone = number;
    this.each(function(position, tile) {
      if (tile)
        tile[0] = this.normalize(position);
      /*if (callback)
        callback.call(this, position, tile)
        */
    }, this)
  }
}

// iterate tiles in 2d order (scan lines)
Map.prototype.each = function(callback, bind, lazy) {
  if (this.width === 1) {
    var prefix = 0;
    var start = this.north(this.west(this.zoned));
  } else {
    var prefix = this.zone * Math.pow(10, this.width);
    var start = 0;
    for (var i = 0; i < this.width; i++)
      start += Math.pow(10, i);
  }
  var width = Math.pow(9, this.width / 2)
  var now = start;
  for (var i = 0; i < width; i++) {
    var prev = now;
    for (var j = 0; j < width; j++) {
      callback.call(bind || this, 
        prefix + now, 
        this.width === 1 ? this.array[i * 3 + j] : this.tileAt(now, true), 
        i * 3 + j)
      now = this.east(now) 
    }
    now = this.south(prev)
  }
};

// visualize state of the map
Map.prototype.draw = function(object) {
  if (object) {
    var id = Game.Object.get(object, 'id');
    var world = Game.maps[id]
    var path = Game.paths && Game.paths.walk && Game.paths.walk[id];
    var queue = Game.queues && Game.queues.look && Game.queues.look[id];
  }

  var index = 0;
  var map = this.width == 1 ? this.array[index++] : this;
  var canvas = this.canvas;
  var context = canvas.getContext('2d')
  var width = Math.pow(3, map.width)
  var size = this.width == 1 ? width * 3 : width;
  var pic = context.createImageData(size, size);
  var data = pic.data;
  if (index) {
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
  var param = (location.search.match(/p=(\d+)/) || [0, null])[1]
  if (param) param = this(param)
  for (; map;) {
    if (index) {
      var mX = ((index - 1) % 3) * width
      var mY = Math.floor((index - 1) / 3) * width
    }
    for (var i = 0, j = map.array.length; i < j; i++) {
        var value = map.array[i];
        if (value !== undefined) {
          if (index) {
            var x = i % width ;
            var y = Math.floor(i / width);
            var pos = ((y + mY) * width * 3 + (x + mX)) * 4;
          } else {
            var pos = i * 4;
          }

          Game.Object.each(value, function(object, type) {
            Game.Object.identify(object, function(definition, type) {
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
            if (path && path.indexOf(value) > -1) {
              data[pos] =
              data[pos + 1] =
              data[pos + 2] = 128
              data[pos + 3] = 255;
            } else if (queue && queue.indexOf(value) > -1) {
              data[pos] =
              data[pos + 1] =
              data[pos + 2] = 230
              data[pos + 3] = 255;
            }
          }
          if (param && param == value) {
            data[pos + 1] = 170 
            data[pos + 3] = data[pos + 3] || 255;
          }
        }
    }
    if (this.width == 1) {
      map = this.array[index++];
    } else
      break
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

  if (index) {
    context.fillStyle = "#dddddd"
    context.font = "bold 7px sans-serif";

    for (var i = 0; i < 9; i++) {
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
      context.fillText(this.array[i].zone % 1000, mX, mY)
    }
  }
}

Map.prototype.walker = function(finish, node, distance, visited, path, queue, meta) {
  var passable = true;
  Game.Object.each(node, function(object, type, value) {
      if (Game.Object.get(object, 'table') != null) {
          passable = false;
      }
  })

  if (!passable)
    return Infinity
  var distance = this.distance(node[0], finish, 'chebyshev');
  if (!distance) {
    return -Infinity
  }
  return distance * 1000000;
};

Map.prototype.finder = function(type, node, distance, visited, path, queue, meta) {
  if (!meta) meta = 0;
  if (node[0] == 11122)
    debugger
  path[meta] = node;
  if (Game.Object.get(node, type || 'resources.food.plants.fruit') != null) {
      //console.log('fruit at', node[0])
      return -Infinity;
  }
}