
// parse data number
function parse(number) {
  var input = 1230567890123
  var digits = Math.floor(Math.log(number) / Math.LN10) + 1;
  var divisor = Math.pow(10, digits - 4);
  var type = Math.floor(number / divisor)
  var remainder = input - type * divisor;
  divisor /= 1000
  var value = Math.floor(remainder / divisor)
  var reference = remainder - number * divisor;
  console.log(type, value, reference)
}


// convert number to x, y
function position(number)
  var x = 0;
  var y = 0;
  var w = 1;
  for (var remainder = number, zoom = 0;;zoom++) {
    var digit = remainder % 10;
    var modifier = Math.pow(3, zoom);
    x += ((digit - 1) % 3) * modifier;
    y += Math.floor((digit - 1) / 3) * modifier
    w *= 3
    if (digit == remainder)
      break;
    remainder = (remainder - digit) / 10;
  }
  return x + y * w
}

// distance
function distance(a, b) {
  var x1 = 0, x2 = 0;
  var y1 = 0, y2 = 0;

  for (var zoom = 0;;zoom++) {
    var d1 = a % 10;
    var d2 = b % 10;
    var modifier = Math.pow(3, zoom);

    x1 += ((d1 - 1) % 3) * modifier;
    y1 += Math.floor((d1 - 1) / 3) * modifier
    x2 += ((d2 - 1) % 3) * modifier;
    y2 += Math.floor((d2 - 1) / 3) * modifier

    if (d1 == a)
      break;
    a = (a - d1) / 10;
    b = (b - d2) / 10
  }
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

// move one square

function left(number) {
  for (var remainder = number, zoom = 0;; zoom++) {
    var digit = remainder % 10;
    var modifier = Math.pow(10, zoom);
    var row = (digit - 1) % 3;
    if (row > 0) {
      number -= modifier * 1
      break
    } else {
      number += modifier * 2
    }
    if (digit == remainder)
      break;
    remainder = (remainder - digit) / 10;
  } 
  return number;
}


function right(number) {
  for (var remainder = number, zoom = 0;; zoom++) {
    var digit = remainder % 10;
    var modifier = Math.pow(10, zoom);
    var row = (digit - 1) % 3;
    if (row < 2) {
      number += modifier * 1
      break
    } else {
      number -= modifier * 2
    }
    if (digit == remainder)
      break;
    remainder = (remainder - digit) / 10;
  } 
  return number;
}



function up(number) {
  for (var remainder = number, zoom = 0;; zoom++) {
    var digit = remainder % 10;
    var modifier = Math.pow(10, zoom);
    var row = Math.floor((digit - 1) / 3);
    if (row > 0) {
      number -= modifier * 3
      break
    } else {
      number += modifier * 6
    }
    if (digit == remainder)
      break;
    remainder = (remainder - digit) / 10;
  } 
  return number;
}


function down(number) {
  for (var remainder = number, zoom = 0;; zoom++) {
    var digit = remainder % 10;
    var modifier = Math.pow(10, zoom);
    var row = Math.floor((digit - 1) / 3);
    if (row < 2) {
      number += modifier * 3
      break
    } else {
      number -= modifier * 6
    }
    if (digit == remainder)
      break;
    remainder = (remainder - digit) / 10;
  } 
  return number;
}

