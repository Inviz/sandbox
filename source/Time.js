// simulate a single tick on a given map
Game.Time = function(time, map) {
  if (time == null)
    time = 0;
   console.profile('Tick ' + time);
  if (map) {
    for (var i = 0, object; object = map.objects[i++];) {
      var creature = Game.Object.Value(object, 'creatures.animals');
      if (creature != null) {
        // increase values over time
        Game.Object.Time(object, time);

        // execute object's current quest and subquests
        Game.Object.Quests(object)

        // move object on its path by one tile
        var path = Game.Object.Path(object)
        if (path)
          Game.Object.Location(object, path);
      }
    }
  }
   console.profileEnd('Tick ' + time);
  return time + 1;
};