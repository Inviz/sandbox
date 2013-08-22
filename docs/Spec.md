# Scalable sandbox world design

# Map

[ 1 | 2 | 3 ]
[ 4 | 5 | 6 ]
[ 7 | 8 | 9 ]

The world is split into 3x3 matrix, where each cell is split into another 3x3 matrix, where each cell is split... so it goes 14 times. 

Cells in 3x3 matrix are numbered from 1 to 9. Cells in matrix that is inside cell 1 will also indexes from 1 to 9, but can be accessed with coordinates 11 to 19.

# Data, bignum api.

16 bytes gives us 16 digits we can use to store data. Data format is the following:

- 4 first digits for type (kind of effect or entity)
- 3 for integer 0...999 (power of effect)
- 1 byte for reference type (reference, polygon, radius)
- 8 bytes for reference payload (object id, location, shape)


[TYPE][INT][R][EFERENCE]

So number:

  10002003400000000

will be parsed as:

  [1000][200][3][400.000.00]

- a fact of type 1000 (e.g. love)
- with value of 200 (e.g. strong)
- reference of type 3 (e.g. to a creature)
- to something 400.000.00. (e.g. cat)

8 bytes of payload is not enough to point to any tile in the world, but it's enough for relative coordinates. This is also a limit to how far can effects reach (raduis about 1km). 

  
    // Example of code to parse data number

    var input = 1234567890123
    var digits = Math.floor(Math.log(input) / Math.LN10) + 1;
    var divisor = Math.pow(10, digits - 4);
    var type = Math.floor(input / divisor)
    var remainder = input - type * divisor;
    divisor /= 1000
    var number = Math.floor(remainder / divisor)
    var reference = remainder - number * divisor;

    console.log(type, number, reference)

## Reference types

### 1. Relative coordinates

  In relative coordinates the first digit specifies how many digits in the current coordinates
  should be replaced with new values.


  5555.555.555.555.50     # Current location, center of the world
              [3][123]    # Relative location, replaces 3 last digits with 123
  5555.555.555.123.50     # Resolved location

### 2. Relative coordinates on a different z-level

To point at a different z-level we have to spend 2 digits

  5.555.555.555.555.50     # Current
                   [49]    # Relative, only z-index specified
  5.555.555.555.555.50     # Resolved

There's only 5 digits to specify a tile, so that leaves us with 120 m radius of reachable space on a different z-level.

  50.5.555.555.555.555     # Current
        [51][5][12.345]    # Relative location, z-index + location
  51.5.555.555.512.345     # Resolved location



### 2. Object (by id)

### 3. One or two general references

### 4. Shape
  Shape reference allows setting up area of effect. Most shape are disclosed around the character, following its orientation. 

  [RRR] - Circle with radius R
  [XXX][YY] - Rectangle X-Y
  [XXX][YYY][ZZ] - Triangle with cathesus X & Y, with Z angle (1-99)

# Data categories

## 1. Location

So absolute coordinates is a path to the cell from the global scope. The world is split into 3x3 cells 14 times:

  - 2 digits for z-index (up to 99)
  - 1 digit is for planet/space zone. (up to 10)
  - 12 digits for surface area (up to 530kmx530km)


  [ZZ][P][XXX.XXX.XXX.XXX]

The coordinates of the center of the world on 50th z-level is:

  50.5.555.555.555.555

and the top left upper corner of the world is

  00.1.111.111.111.111



### 2. Object 

Instance of item or creature, e.g. that minotaur or this monster axe. 

Objects are identified by id. So having 8 bytes for id, we can have up to 100 millions objecs.

### 3. Creature 

Kind of creature or plant in general sense, e.g. some chicken or grass.

### 4. Item 

Kind of item in general sense, e.g. some sword or microscope.

### 5. Actions

Kind of action, e.g. swimming or bowmaking

### 6. Properties

Kind of object quality, e.g. flexible or happy

### 7. Resources

Kind of material, e.g. wood or metal
