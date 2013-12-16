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
      }
    }
  }
   console.profileEnd('Tick ' + time);
  return time + 1;
};