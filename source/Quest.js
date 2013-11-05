
// Execute and schedule subquests  
Game.Quest = function(object, type, value, reference) {
  var quest = Game.Property(type, value, reference);
  var id = Game.Object.ID(object);
  var result;
  var steps = quest.type.parsed
  if (!steps)
    return;
  console.log.apply(console, Game.Object.inspect(object))
  for (var i = 0, action; action = steps[i++];) {
    var command = action.type;
    if (command.execute) {
      var key = command.output;
      var output = key && Game.Object.Output(id, key)
      console.info(output == null ? 'start' : 'exec', [command._path])
      var result = Game.Object.Action(object, quest, command, argument, output, reference);
      if (key)
        Game.Object.Output(id, key, result);
      var argument = result;
      var result = output;
      if (result === false) {
        Game.Object.set(object, type, 0)
        if (!steps[i])
          break;
      }
    } else {
      if (!command.precondition || command.precondition.call(this)) {
        var o = Game.Object.Value(object, t);
        if (!o)
          Game.Object.increment(object, t, p, reference)
      }
    }
  }
  return result;
}

Game.Quest.Location = function(quest, value) {
  if (value.locations) {
    if (this.distance && this.distance < value.result.length)
      return;
    else
      return Game.Path.Location(value);
  }
  return Game.Object.Location(value);
};