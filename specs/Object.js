describe('object', function() {
  describe('when used as a constructor', function() {
    it ('should return array', function() {

    })
  })
  describe('when used as a function', function() {
    describe('when given a type', function() {
      it('should create an array representing object', function() {
        var object = Game.Object(
          'creatures.plants.trees.oak'
        );
        expect(object).toEqual([
          Game.valueOf('creatures.plants.trees.oak')
        ])
      })

      describe('and a property', function() {
        it('should create an array representing object and assign property', function() {
          var object = Game.Object(
            'oak',
            Game.valueOf('id', 321)
          );
          expect(object).toEqual([
            Game.valueOf('creatures.plants.trees.oak'),
            Game.valueOf('properties.personal.formal.id', 321)
          ]);

          Game.Object.set(object, 'id', 555)
          expect(object).toEqual([
            Game.valueOf('creatures.plants.trees.oak'),
            Game.valueOf('properties.personal.formal.id', 555)
          ]);

          Game.Object.increment(object, 'id', -5)
          expect(object).toEqual([
            Game.valueOf('creatures.plants.trees.oak'),
            Game.valueOf('properties.personal.formal.id', 550)
          ]);
        })
      })
    })
  })

  describe('#get', function() {
    it ('should return properties', function() {
      var object = [
        Game.valueOf('creatures.plants.trees.oak'),
        Game.valueOf('properties.personal.formal.id', 321)
      ];
      expect(Game.Object.get(object, 'properties.personal.formal.id')).toBe(321)
    })
    it ('should calculate properties', function() {
      var object = Game().concat(
        Game.valueOf('creatures.plants.trees.oak'),
        Game.valueOf('properties.personal.formal.age', 29),
        Game.valueOf('properties.personal.formal.age', -7)
      );
      expect(Game.Object.get(object, 'age')).toBe(22)
      //expect(Game.Object.get(object, 'properties.personal.formal.id')).toBeTruthy()
    })
    it ('should calculate properties and iterate equipment', function() {
      var object = Game('oak',
        Game.valueOf('properties.personal.formal.id', 1),
        Game.valueOf('properties.personal.stats.strength', 31),
        Game.valueOf('properties.belonging.equipment.hands', 1, 'object', Game.Object(
          'items.wear.handwear.gloves',
          Game.valueOf('properties.personal.formal.id', 2),
          Game.valueOf('properties.personal.stats.strength', 7)
        )),
        Game.valueOf('properties.belonging.equipment.head', 22, 'object', Game.Object(
          'items.wear.headwear.cap',
          Game.valueOf('properties.personal.formal.id', 3),
          Game.valueOf('properties.personal.stats.strength', -17)
        )),
        Game.valueOf('properties.belonging.equipment.head', 333, 'object', Game.Object(
          'items.wear.bodywear.breastplate',
          Game.valueOf('properties.personal.formal.id', 4)
        ))
      );
      expect(Game.Object.get(object, 'properties.personal.stats.strength')).toBe(21)
    })
    it ('should calculate properties in referenced objects', function() {
      var object = Game.Object(
        'creatures.animals.primates.human'
      )
      expect(Game.Object.get(object, 'longevity')).toBe(Game.creatures.animals.primates.human.longevity)

    })
  })
})