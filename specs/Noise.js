
function snoise(vx, vy) {
  var Cx =   0.211324865405187;  // (3.0-sqrt(3.0))/6.0
  var Cy =   0.366025403784439;  // 0.5*(sqrt(3.0)-1.0)
  var Cz =  -0.577350269189626;  // -1.0 + 2.0 * C.x
  var Cw =   0.024390243902439; // 1.0 / 41.0

// First corner

  var idot = (vx * Cy) + (vy * Cy)
  var ix = Math.floor(vx + idot)
  var iy = Math.floor(vy + idot)

  var x0dot = (ix * Cx) + (iy * Cx)
  var x0x = vx - ix + x0dot
  var x0y = vy - iy + x0dot

// Other corners
  var i1x = x0x > x0y ? 1 : 0;
  var i1y = x0x > x0y ? 0 : 1;

  var x12x = x0x + Cx;
  var x12y = x0y + Cx;
  var x12z = x0x + Cz;
  var x12w = x0y + Cz;

  x12x -= i1x
  x12y -= i1y

// Permutations
  // Avoid truncation effects in permutation
  ix %= 289;
  iy %= 289;

  var tx = iy
  var ty = iy + i1y
  var tz = iy + 1

  tx = ((tx * 34 + 1) * tx) % 289;
  ty = ((ty * 34 + 1) * ty) % 289;
  tz = ((tz * 34 + 1) * tz) % 289;

  tx = tx + ix
  ty = ty + ix + i1x
  tz = tz + ix + 1

  var px = ((tx * 34 + 1) * tx) % 289;
  var py = ((ty * 34 + 1) * ty) % 289;
  var pz = ((tz * 34 + 1) * tz) % 289;

  var mx = Math.max(0, 0.5 - ((x0x * x0x) + (x0y * x0y)))
  var my = Math.max(0, 0.5 - ((x12x * x12x) + (x12y * x12y)))
  var mz = Math.max(0, 0.5 - ((x12z * x12z) + (x12w * x12w)))

  mx = Math.pow(mx, 4);
  my = Math.pow(my, 4);
  mz = Math.pow(mz, 4);

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  var xx = 2 * ((px * Cw) % 1) - 1
  var xy = 2 * ((py * Cw) % 1) - 1
  var xz = 2 * ((pz * Cw) % 1) - 1

  var hx = Math.abs(xx) - 0.5
  var hy = Math.abs(xy) - 0.5
  var hz = Math.abs(xz) - 0.5

  var oxx = Math.floor(xx + 0.5)
  var oxy = Math.floor(xy + 0.5)
  var oxz = Math.floor(xz + 0.5)

  var a0x = xx - oxx
  var a0y = xy - oxy
  var a0z = xz - oxz

  mx *= 1.79284291400159 - 0.85373472095314 * (a0x * a0x + hx * hx)
  my *= 1.79284291400159 - 0.85373472095314 * (a0y * a0y + hy * hy)
  mz *= 1.79284291400159 - 0.85373472095314 * (a0z * a0z + hz * hz)

  var gx = a0x * x0x + hx * x0y;
  var gy = a0y * x12x + hy * x12y;
  var gz = a0z * x12z + hz * x12w;

  return 130 * ((gx * mx) + (gy * my) + (gz * mz));
}