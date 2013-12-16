Game.Action = function(object, quest, command, input, output) {
  if (command.input)
    input = Game[command.input](input);
  if (command._execute) {
    var result = command._execute.call(object, input, output, command, quest)
    if (result != null)
      return result;
  }
  var result = command.execute.call(object, input, output, command, quest);
  if (command.condition && command.condition.call(object, input, result, quest, command)) { 
    console.log(command.condition.call(object, input, result, quest, command))
    if (!command.complete || command.complete.call(object, input, result, quest, command) !== false) {
      console.info('done', [command._path])
      if (command.cleanup)
        command.cleanup.call(object, input, result, command, quest);

      if (output)
        Game.Object.Output(object, null)
    }
  }
  return result;
}