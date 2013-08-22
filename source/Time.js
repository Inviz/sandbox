Time = function(time, map) {
  if (time == null)
    time = 0;
  time++;
  if (map) {
    for (var i = 0, object; object = map.objects[i++];) {
      var creature = Game.Object.max(object, 'creatures.animals');
      if (creature != null) {
        var id = Game.Object.get(object, 'id');
        if (Game.paths.walk)
          var path = Game.paths.walk[id];
        if (path) {
          var popped = path.pop();
          var last = path[path.length - 1];
//          console.log(path.slice(), last, popped)
          if (last) {
            var from = map(Game.Object.get(object, 1));
            var north = map.north(from[0])
            var south = map.south(from[0])
            if (north == last) {
              Game.vectors[id] = 'north'
            } else if (map.east(from[0]) == last) {
              Game.vectors[id] = 'east'
            } else if (south == last) {
              Game.vectors[id] = 'south'
            } else if (map.west(from[0]) == last) {
              Game.vectors[id] = 'west'
            } else if (map.east(north) == last) {
              Game.vectors[id] = 'northeast'
            } else if (map.east(south) == last) {
              Game.vectors[id] = 'southeast'
            } else if (map.west(north) == last) {
              Game.vectors[id] = 'northwest'
            } else if (map.west(south) == last) {
              Game.vectors[id] = 'southwest'
            }
//            console.log('from', Game.vectors[id], last, 'to', map(Game.Object.get(object, 1)))
            map.move(last, object, from);
          }
        }
        Game.Object.increment(object, 'hunger', 1);
//        console.error(path, id, Game[creature]._reference)
      }
    }
  }
  return time;
};
