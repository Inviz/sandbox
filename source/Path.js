
// find path from a location
// stores all intermediate computations 
// to resume pathfinding in future
// callback determines path by returning 
// weight for each map cell

Game.Path = function(map, location, callback, max, levels, output, vector) {
  if (this instanceof Game.Path) {
    return {
      result: [],
      queues: [],
      locations: [],
      distances: [],
      qualities: [],
      backtrace: [],
      processed: [],
      map: map
    }
  }
  var start = location = Game.Object.Coordinates(location);
  var path = output && output.result;
  if (path) {
    if (path.length) {
      start = path[0][0]
      // increase max. range to visit more nodes
      if (levels == null) {
        var prev = path[path.length - 1];
        if (prev) {
          var last = prev[0];
          var pos = output.locations.indexOf(last);
          if (pos > -1)
            max += output.distances[pos]
        }
      }
    }
  }

  // launch pathfinding on a given map zoom level
  // may zoom out when reached pathfinding limit 
  var limit = (levels || 0) + 1
  loop: for (var level = 0; level < limit; level++) {
    var result = output && output.result;
    // reconsider path by recalculating quality for each step
    if (result && result.length) {
      var i = levels ? level - 2 : result.length - 1
      for (var node;;) {
        var node = result[i];
        if (node) {
          var pos = output.locations.indexOf(node[0]);
          var distance = output.distances[pos];
          var quality = callback.call(map, node, distance, i, output);
          // if result is in the way already, truncate path
          switch (quality) {
            case -Infinity:
              if (!levels || result[i + 1]) {
                var j = levels ? i + 1 : i;
                var removed = result.splice(j, result.length - i);
                if (!levels)
                  output.result = removed; 
              }
              break loop;
          }
        }
        if (levels) {
          if (i == level - 1)
            break;
          i++
        } else {
          if (!node)
            break;
          i--
        }
      }
    }

    // perform search on lower zoom levels
    if (levels) {
      if (level > 1) {
        start = Game.Coordinates.up(level == 2 ? location : start);
        if (map.zone == start)
          break;
        if (vector) {
          if (!z)
            var z = Game.Coordinates.opposite(location, vector)
          z = Game.Coordinates.up(z);
          if (z == start) {
            break;
          }
        }
      }
      if (level > 0)
        output = map.walk(start, callback, max, level - 1, vector, output)
    } else {
      output = map.walk(start, callback, max, null, null, output)
    }
  }
  return output;
}

Game.Path.Location = function(path) {
  var coordinates = Game.Path.Coordinates(path);
  return path.map.tileAt(coordinates);
};

Game.Path.Coordinates = function(path) {
  result = path.result
  return result[result.length - 1][0]
}

Game.Path.pop = function(path) {
  var coordinates = path.result.pop();
  if (!coordinates)
    return;
  return Game.Map.Location(path.map, coordinates);
}
