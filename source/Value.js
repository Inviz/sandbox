Game.Value = function(number) {
  // remove reference
  if (number > 9999999)
    number = Math.floor(number / 1000000000);
  // return value without type
  return number % 1000;
}