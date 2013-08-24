// simulate a single tick on a given map
Time = function(time, map) {
  if (time == null)
    time = 0;
  if (map) {
    for (var i = 0, object; object = map.objects[i++];) {
      var creature = Game.Object.max(object, 'creatures.animals');
      if (creature != null) {
        var id = Game.Object.get(object, 'id');

        // move object on its path by one tile
        if (Game.paths.walk) {
          var path = Game.paths.walk[id];
          if (path) {
            var popped = path.pop();
            var to = path[path.length - 1];
            if (to) {
              var from = Game.Object.get(object, 1);
              Game.vectors[id] = map.vector(from, to[0])
              map.move(from, to, object);
            }
          }
        }

        // increase values over time
        if (time % 4 == 0)
          Game.Object.increment(object, 'hunger', 1);
        
        // execute object's current quest and subquests
        for (var current, prev; 
            (current = Game.Object.max(object, 'quests')) != prev;
            prev = current) {
          var value = Game.valueOf(current);
          var type = Game[Game.typeOf(current)]
          if (type.actions)
            Game.Object.invoke(object, type, value);
        }
      }
    }
  }
  return time + 1;
};
