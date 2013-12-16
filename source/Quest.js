
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
      // skip action (too far away, no tools, etc)
      if (result === false)
        continue;
      // wait for completion
      if (typeof result == 'number') {
        console.error(result, 'LOOOOL')
        break;
      }
      if (result === true) {
        Game.Object.Value.set(object, quest.type, 0);
        if (!steps[i])
          break;
      }
      var argument = result;
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