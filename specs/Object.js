describe('object', function() {
  describe('when used as a constructor', function() {
    it ('should return array', function() {

    })
  })
  describe('when used as a function', function() {
    describe('when given a type', function() {
      it('should create an array representing object', function() {
        var object = new Game.Object(
          'creatures.plants.trees.oak'
        );
        expect(object).toEqual([
          Game.Value('creatures.plants.trees.oak')
        ])
      })

      describe('and a property', function() {
        it('should create an array representing object and assign property', function() {
          var object = new Game.Object(
            'oak',
            Game.Value('id', 321)
          );
          expect(object).toEqual([
            Game.Value('creatures.plants.trees.oak'),
            Game.Value('properties.personal.formal.id', 321)
          ]);

          Game.Object.Value.set(object, 'id', 555)
          expect(object).toEqual([
            Game.Value('creatures.plants.trees.oak'),
            Game.Value('properties.personal.formal.id', 555)
          ]);

          Game.Object.Value.increment(object, 'id', -5)
          expect(object).toEqual([
            Game.Value('creatures.plants.trees.oak'),
            Game.Value('properties.personal.formal.id', 550)
          ]);
        })
      })
    })
  })
})
describe("Game.Object.Value", function() {
  describe("iterators", function() {
    it ('should return maximum value matching reference', function() {
      var object = Game().concat(
        Game.Value('creatures.plants.trees.oak'),
        Game.Value('properties.personal.formal.age', 29),
        Game.Value('properties.personal.formal.age', -7),
        Game.Value('properties.personal.formal.age', 39, Game.Reference('object', 123)),
        Game.Value('properties.personal.formal.age', -18, Game.Reference('object', 123))
      );
      expect(Game.Object.Value.max(object, 'age')).toBe(29)
      expect(Game.Object.Value.min(object, 'age')).toBe(-7)
      expect(Game.Object.Value.sum(object, 'age')).toBe(22)
      expect(Game.Object.Value.max(object, 'age', Game.Reference('object', 123))).toBe(39)
      expect(Game.Object.Value.min(object, 'age', Game.Reference('object', 123))).toBe(-18)
      expect(Game.Object.Value.sum(object, 'age', Game.Reference('object', 123))).toBe(21)
      
      var log = [];
      expect(Game.Object.Value(object, 'age', function(object, type, value, reference) {
        if (value == 0)
          debugger
        log.push([object, type, value, reference])
      })).toBe(22)
      expect(log).toEqual([
        [object, Game.age, 29, null], 
        [object, Game.age, -7, null]
      ]);

      var log = [];
      expect(Game.Object.Value(object, 'personal', Game.Reference('object', 123), function(object, type, value, reference) {
        log.push([object, type, value, reference])
      })).toBe(21)
      expect(log).toEqual([
        [object, Game.age, 39, Game.Reference('object', 123)], 
        [object, Game.age, -18, Game.Reference('object', 123)]
      ]);

    })
  })
  describe('()', function() {
    it ('should return properties', function() {
      var object = [
        Game.Value('creatures.plants.trees.oak'),
        Game.Value('properties.personal.formal.id', 321)
      ];
      expect(Game.Object.Value(object, 'properties.personal.formal.id')).toBe(321)
    })
    it ('should calculate properties', function() {
      var object = Game().concat(
        Game.Value('creatures.plants.trees.oak'),
        Game.Value('properties.personal.formal.age', 29),
        Game.Value('properties.personal.formal.age', -7)
      );
      expect(Game.Object.Value(object, 'age')).toBe(22)
      //expect(Game.Object.Value(object, 'properties.personal.formal.id')).toBeTruthy()
    })
    it ('should calculate properties and iterate equipment', function() {
      var gloves = new Game.Object(
        'items.wear.handwear.gloves',
        Game.Value('properties.personal.formal.id', 2),
        Game.Value('properties.personal.stats.strength', 7)
      );
      var cap = new Game.Object(
        'items.wear.headwear.cap',
        Game.Value('properties.personal.formal.id', 3),
        Game.Value('properties.personal.stats.strength', -17)
      )
      var armor = new Game.Object(
        'items.wear.bodywear.breastplate',
        Game.Value('properties.personal.formal.id', 4)
      )

      var object = Game('oak',
        Game.Value('properties.personal.formal.id', 1),
        Game.Value('properties.personal.stats.strength', 31),
        Game.Value('properties.belonging.equipment.hands', 1, Game.Reference('object', gloves)),
        Game.Value('properties.belonging.equipment.head', 22, Game.Reference('object', cap)),
        Game.Value('properties.belonging.equipment.head', 333, Game.Reference('object', armor)))

      // calculate total
      expect(Game.Object.Value(object, 'properties.personal.stats.strength')).toBe(21)

      // callback is fired with referenced objects as first argument
      // returns total
      var log = [];
      expect(Game.Object.Value(object, 'strength', function(object, type, value, reference) {
        log.push([object, type, value, reference])
      })).toBe(21)
      expect(log).toEqual([
        [object, Game.strength, 31, null], 
        [gloves, Game.strength, 7, null], 
        [cap, Game.strength, -17, null]
      ]);

      // find matching properties on equipment, modify values via map
      var log = [];
      expect(Game.Object.Equipment.Property.map(object, 'strength', function(object, type, value, reference) {
        log.push([object, type, value, reference])
        return value + 1;
      })).toEqual([Game.Value(Game.strength, 8), Game.Value(Game.strength, -16)])
      expect(log).toEqual([ 
        [gloves, Game.strength, 7, null], 
        [cap, Game.strength, -17, null]
      ]);

      // only query equipment for values
      var log = [];
      expect(Game.Object.Equipment.Value.map(object, 'strength', function(object, type, value, reference) {
        log.push([object, type, value, reference])
      })).toEqual([7, -17])
      expect(log).toEqual([ 
        [gloves, Game.strength, 7, null], 
        [cap, Game.strength, -17, null]
      ]); 

      // fetch a single own property with callback
      var log = [];
      expect(Game.Object.Stats.Property(object, 'strength', function(object, type, value, reference) {
        log.push([object, type, value, reference])
      })).toEqual(object[2])
      expect(log).toEqual([ 
        [object, Game.strength, 31, null]
      ]);

    })
    it ('should calculate properties in referenced objects', function() {
      var object = new Game.Object(
        'creatures.animals.primates.human'
      )
      expect(Game.Object.Value(object, 'longevity')).toBe(Game.creatures.animals.primates.human.longevity)


      var log = [];
      expect(Game.Object.Property(object, 'longevity', function(object, type, value, reference) {
        log.push([object, type, value, reference])
      })).toBe(Game.human[0])
      expect(log).toEqual([ 
        [Game.human, Game.longevity, 120, null]
      ]);
    })
    it ('should filter properties by reference', function() {
      var object = new Game.Object(
        'human',
        Game.Value('strength', 7),
        Game.Value('strength', -3),
        Game.Value('strength', -1, Game.Reference('area', 123)),
        Game.Value('strength', 9, Game.Reference('object', 321))
      )
      expect(Game.Object.Value(object, 'strength')).toBe(4)
      expect(Game.Object.Value(object, 'strength', Game.Reference('area', 123))).toBe(-1)
      expect(Game.Object.Value(object, 'strength', Game.Reference('object', 321))).toBe(9)
    })
  })
})

describe("Game.Object.Property", function() {
  describe("iterators", function() {
    it ('should return property matching reference', function() {
      var object = Game().concat(
        Game.Value('creatures.plants.trees.oak'),
        Game.Value('properties.personal.formal.age', 29),
        Game.Value('properties.personal.formal.age', -7),
        Game.Value('properties.personal.formal.age', 39, Game.Reference('object', 321)),
        Game.Value('properties.personal.formal.age', -18, Game.Reference('object', 321))
      );

      expect(Game.Object.Property.max(object, 'age')).toBe(Game.Value('properties.personal.formal.age', 29))
      expect(Game.Object.Property.min(object, 'age')).toBe(Game.Value('properties.personal.formal.age', -7))
      expect(Game.Object.Property.sum(object, 'age')).toBe(Game.Value('properties.personal.formal.age', 22))
      expect(Game.Object.Property.max(object, 'age', Game.Reference('object', 321))).toBe(Game.Value('properties.personal.formal.age', 39, Game.Reference('object', 321)))
      expect(Game.Object.Property.min(object, 'age', Game.Reference('object', 321))).toBe(Game.Value('properties.personal.formal.age', -18, Game.Reference('object', 321)))
      expect(Game.Object.Property.sum(object, 'age', Game.Reference('object', 321))).toBe(Game.Value('properties.personal.formal.age', 21, Game.Reference('object', 321)))
    })
  })
})