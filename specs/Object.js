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

          Game.Object.set(object, 'id', 555)
          expect(object).toEqual([
            Game.Value('creatures.plants.trees.oak'),
            Game.Value('properties.personal.formal.id', 555)
          ]);

          Game.Object.increment(object, 'id', -5)
          expect(object).toEqual([
            Game.Value('creatures.plants.trees.oak'),
            Game.Value('properties.personal.formal.id', 550)
          ]);
        })
      })
    })
  })

  describe('#get', function() {
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
      var object = Game('oak',
        Game.Value('properties.personal.formal.id', 1),
        Game.Value('properties.personal.stats.strength', 31),
        Game.Value('properties.belonging.equipment.hands', 1, 'object', new Game.Object(
          'items.wear.handwear.gloves',
          Game.Value('properties.personal.formal.id', 2),
          Game.Value('properties.personal.stats.strength', 7)
        )),
        Game.Value('properties.belonging.equipment.head', 22, 'object', new Game.Object(
          'items.wear.headwear.cap',
          Game.Value('properties.personal.formal.id', 3),
          Game.Value('properties.personal.stats.strength', -17)
        )),
        Game.Value('properties.belonging.equipment.head', 333, 'object', new Game.Object(
          'items.wear.bodywear.breastplate',
          Game.Value('properties.personal.formal.id', 4)
        ))
      );
      expect(Game.Object.Value(object, 'properties.personal.stats.strength')).toBe(21)
    })
    it ('should calculate properties in referenced objects', function() {
      var object = new Game.Object(
        'creatures.animals.primates.human'
      )
      expect(Game.Object.Value(object, 'longevity')).toBe(Game.creatures.animals.primates.human.longevity)
    })
    it ('should filter properties by reference', function() {
      var object = new Game.Object(
        'human',
        Game.Value('strength', 7),
        Game.Value('strength', -3),
        Game.Value('strength', -1, 'area', 123),
        Game.Value('strength', 9, 'object', 321)
      )
      expect(Game.Object.Value(object, 'strength')).toBe(4)
      expect(Game.Object.Value(object, 'strength', 'area', 123)).toBe(-1)
      expect(Game.Object.Value(object, 'strength', 'object', 321)).toBe(9)
    })
  })
})