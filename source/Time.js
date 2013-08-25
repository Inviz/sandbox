// simulate a single tick on a given map
Time = function(time, map) {
  if (time == null)
    time = 0;
  // console.group('Tick ' + time);
  if (map) {
    for (var i = 0, object; object = map.objects[i++];) {
      var creature = Game.Object.max(object, 'creatures.animals');
      if (creature != null) {
        var id = Game.Object.get(object, 'id');

        // move object on its path by one tile
        if (Game.output.walk) {
          var cache = Game.output.walk[id];
          if (cache && cache.next) {
            var from = Game.Object.get(object, 1);
            map.move(from, cache.next, object)
            Game.vectors[id] = map.vector(from, cache.next[0]);
            cache.next = null;
          } else {
            Game.vectors[id] = null;
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
          if (type.steps)
            Game.Object.invoke(object, type, value, null, null, null, id);
        }
      }
    }
  }
  // console.groupEnd('Tick ' + time);
  return time + 1;
};
