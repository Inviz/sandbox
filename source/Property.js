Game.Property = function(number, value, reference) {
  if (number._index) {
    var type = number
  } else {
    if (number < 0) {
      var negate = true;
      number = -number;
    }
    if (number > 9999) {
      var digits = Math.floor(Math.log(number) / Math.LN10) + 1;
      var divisor = Math.pow(10, digits - 1);
      if (number > divisor && number < divisor * 2) {
        type = 1
        value = number - divisor
      } else {
        divisor /= 1000
        var type = Math.floor(number / divisor)
        var remainder = number - type * divisor;
        divisor /= 1000
        var v = Math.floor(remainder / divisor)
        if (value == null)
          value = negate ? - v : v;
        if (reference == null)
          var reference = remainder - v * divisor;
        if (reference && typeof reference == 'number')
          reference = Game.Reference(reference)
      }
    } else {
      type = number
    }
    type = Game[type]
  }
  var result = this instanceof Game.Property ? this : {} 
  result.type = type
  if (value != null)
    result.value = value;
  if (reference)
    result.reference = reference;
  return result;
}
