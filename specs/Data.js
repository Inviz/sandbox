describe('Data', function() {
  var payload = {
    weapons: {
      deadly: true,

      ranged: {
        crossbow: {},
        bow: {}
      },
      throwing: {
        knife: {}
      },
      melee: {
        sword: {},
        spear: {}
      }
    },
    clothing: {
      bodywear: {
        breastplate: {}
      },
      headwear: {
        cap: {}
      }
    },
    food: {}
  }
  var data = new Game.Type(payload, 0)
  var outer = new Game.Type({
    data: payload
  }, 0)
  describe('with prefix', function() {

    it ('should index given properties', function() {
      expect(outer.data._index).toBe(1)
      expect(outer.data.weapons._index).toBe(10)
      expect(outer.data.weapons.ranged._index).toBe(100)
      expect(outer.data.weapons.ranged.crossbow._index).toBe(1000)
      expect(outer.data.weapons.ranged.bow._index).toBe(1001)
      expect(outer.data.weapons.throwing._index).toBe(101)
      expect(outer.data.weapons.throwing.knife._index).toBe(1010)
      expect(outer.data.weapons.melee._index).toBe(102)
      expect(outer.data.weapons.melee.sword._index).toBe(1020)
      expect(outer.data.weapons.melee.spear._index).toBe(1021)
      expect(outer.data.clothing._index).toBe(11)
      expect(outer.data.clothing.bodywear._index).toBe(110)
      expect(outer.data.clothing.bodywear.breastplate._index).toBe(1100)
      expect(outer.data.clothing.headwear._index).toBe(111)
      expect(outer.data.clothing.headwear.cap._index).toBe(1110)
      expect(outer.data.food._index).toBe(12)
    })

    it ('should index properties in parents', function() {
      expect(outer[1]).toBe(outer.data);
      expect(outer[10]).toBe(outer.data.weapons);
      expect(outer[100]).toBe(outer.data.weapons.ranged);
      expect(outer[1000]).toBe(outer.data.weapons.ranged.crossbow);
      expect(outer[1001]).toBe(outer.data.weapons.ranged.bow);
      expect(outer[101]).toBe(outer.data.weapons.throwing);
      expect(outer[1010]).toBe(outer.data.weapons.throwing.knife);
      expect(outer[102]).toBe(outer.data.weapons.melee);
      expect(outer[1020]).toBe(outer.data.weapons.melee.sword);
      expect(outer[1021]).toBe(outer.data.weapons.melee.spear);
      expect(outer[11]).toBe(outer.data.clothing);
      expect(outer[110]).toBe(outer.data.clothing.bodywear);
      expect(outer[1100]).toBe(outer.data.clothing.bodywear.breastplate);
      expect(outer[111]).toBe(outer.data.clothing.headwear);
      expect(outer[1110]).toBe(outer.data.clothing.headwear.cap);
      expect(outer[12]).toBe(outer.data.food);
    })
    it ('should propagate properties', function() {
      expect(outer.data.deadly).toBe(undefined)
      expect(outer.data.weapons.deadly).toBe(true)
      expect(outer.data.weapons.ranged.deadly).toBe(true)
      expect(outer.data.weapons.ranged.crossbow.deadly).toBe(true)
      expect(outer.data.weapons.ranged.bow.deadly).toBe(true)
      expect(outer.data.weapons.throwing.deadly).toBe(true)
      expect(outer.data.weapons.throwing.knife.deadly).toBe(true)
      expect(outer.data.weapons.melee.deadly).toBe(true)
      expect(outer.data.weapons.melee.sword.deadly).toBe(true)
      expect(outer.data.weapons.melee.spear.deadly).toBe(true)
      expect(outer.data.clothing.deadly).toBe(undefined)
      expect(outer.data.clothing.bodywear.deadly).toBe(undefined)
      expect(outer.data.clothing.bodywear.breastplate.deadly).toBe(undefined)
      expect(outer.data.clothing.headwear.deadly).toBe(undefined)
      expect(outer.data.clothing.headwear.cap.deadly).toBe(undefined)
      expect(outer.data.food.deadly).toBe(undefined)
    })

    describe('when used as a function', function() {
      describe('and given key', function() {
        it ('should fetch category number', function() {
          expect(outer.indexOf('data.weapons')).toBe(10000000000000)
          expect(outer.indexOf('data.weapons.ranged')).toBe(100000000000000)
          expect(outer.indexOf('data.weapons.ranged.crossbow')).toBe(1000000000000000)
          expect(outer.indexOf('data.weapons.ranged.bow')).toBe(1001000000000000)
          expect(outer.indexOf('data.weapons.throwing')).toBe(101000000000000)
          expect(outer.indexOf('data.weapons.throwing.knife')).toBe(1010000000000000)
          expect(outer.indexOf('data.weapons.melee')).toBe(102000000000000)
          expect(outer.indexOf('data.weapons.melee.sword')).toBe(1020000000000000)
          expect(outer.indexOf('data.weapons.melee.spear')).toBe(1021000000000000)
          expect(outer.indexOf('data.clothing')).toBe(11000000000000)
          expect(outer.indexOf('data.clothing.bodywear')).toBe(110000000000000)
          expect(outer.indexOf('data.clothing.bodywear.breastplate')).toBe(1100000000000000)
          expect(outer.indexOf('data.clothing.headwear')).toBe(111000000000000)
          expect(outer.indexOf('data.clothing.headwear.cap')).toBe(1110000000000000)
          expect(outer.indexOf('data.food')).toBe(12000000000000)
          expect(outer.indexOf('data.fool')).toBe(0)
          expect(outer.indexOf('dato')).toBe(0)
          expect(outer.data.indexOf('weapons')).toBe(10000000000000)
          expect(outer.data.indexOf('weapons.ranged')).toBe(100000000000000)
          expect(outer.data.indexOf('weapons.ranged.crossbow')).toBe(1000000000000000)
          expect(outer.data.indexOf('weapons.ranged.bow')).toBe(1001000000000000)
          expect(outer.data.indexOf('weapons.throwing')).toBe(101000000000000)
          expect(outer.data.indexOf('weapons.throwing.knife')).toBe(1010000000000000)
          expect(outer.data.indexOf('weapons.melee')).toBe(102000000000000)
          expect(outer.data.indexOf('weapons.melee.sword')).toBe(1020000000000000)
          expect(outer.data.indexOf('weapons.melee.spear')).toBe(1021000000000000)
          expect(outer.data.indexOf('clothing')).toBe(11000000000000)
          expect(outer.data.indexOf('clothing.bodywear')).toBe(110000000000000)
          expect(outer.data.indexOf('clothing.bodywear.breastplate')).toBe(1100000000000000)
          expect(outer.data.indexOf('clothing.headwear')).toBe(111000000000000)
          expect(outer.data.indexOf('clothing.headwear.cap')).toBe(1110000000000000)
          expect(outer.data.indexOf('food')).toBe(12000000000000)
          expect(outer.data.indexOf('fool')).toBe(0);
        })

        it ('should fetch category number by a partial key', function() {
          expect(outer.valueOf('ranged')).toBe(outer.valueOf('data.weapons.ranged'));
        })

        describe('and given value', function() {
          it ('should make a number that has both key and value', function() {
            expect(outer.data.indexOf('weapons', 123)).toBe(10123000000000);
            expect(outer.data.indexOf('weapons', -123)).toBe(-10123000000000);
            expect(outer.data.indexOf('weapons', 12)).toBe(10012000000000);
            expect(outer.data.indexOf('weapons', 0)).toBe(10000000000000);
            expect(outer.data.indexOf('clothing.headwear.cap', 123)).toBe(1110123000000000);
            expect(outer.data.indexOf('clothing.headwear.cap', -123)).toBe(-1110123000000000);
            expect(outer.data.indexOf('clothing.headwear.cap', 12)).toBe(1110012000000000);
            expect(outer.data.indexOf('clothing.headwear.cap', 0)).toBe(1110000000000000);
            expect(outer.indexOf('data.weapons', 123)).toBe(10123000000000);
            expect(outer.indexOf('data.weapons', -123)).toBe(-10123000000000);
            expect(outer.indexOf('data.weapons', 12)).toBe(10012000000000);
            expect(outer.indexOf('data.weapons', 0)).toBe(10000000000000);
            expect(outer.indexOf('data.clothing.headwear.cap', 123)).toBe(1110123000000000);
            expect(outer.indexOf('data.clothing.headwear.cap', -123)).toBe(-1110123000000000);
            expect(outer.indexOf('data.clothing.headwear.cap', 12)).toBe(1110012000000000);
            expect(outer.indexOf('data.clothing.headwear.cap', 0)).toBe(1110000000000000);
          })

          describe('and given reference', function() {
            describe('which is object', function() {
              it ('should make a reference to that object by id', function() {
                var object = {
                  id: 12345678
                }
                expect(outer.data.indexOf('weapons', 123, Game.Reference('object', object))).toBe(10123212345678)
                expect(outer.data.indexOf('weapons', -123, Game.Reference('object', object))).toBe(-10123212345678)
                expect(outer.data.indexOf('weapons', 123, Game.Reference(2, object))).toBe(10123212345678)
                expect(outer.data.indexOf('weapons', -123, Game.Reference(2, object))).toBe(-10123212345678)
                expect(outer.indexOf('data.weapons', 123, Game.Reference('object', object))).toBe(10123212345678)
                expect(outer.indexOf('data.weapons', -123, Game.Reference('object', object))).toBe(-10123212345678)
                expect(outer.indexOf('data.weapons', 123, Game.Reference(2, object))).toBe(10123212345678)
                expect(outer.indexOf('data.weapons', -123, Game.Reference(2, object))).toBe(-10123212345678)
              })
            })
          })
        })
      })
    })
    
  })
  describe('without prefix', function() {
    it ('should index given properties', function() {
      expect(data.weapons._index).toBe(1)
      expect(data.weapons.ranged._index).toBe(10)
      expect(data.weapons.ranged.crossbow._index).toBe(100)
      expect(data.weapons.ranged.bow._index).toBe(101)
      expect(data.weapons.throwing._index).toBe(11)
      expect(data.weapons.throwing.knife._index).toBe(110)
      expect(data.weapons.melee._index).toBe(12)
      expect(data.weapons.melee.sword._index).toBe(120)
      expect(data.weapons.melee.spear._index).toBe(121)
      expect(data.clothing._index).toBe(2)
      expect(data.clothing.bodywear._index).toBe(20)
      expect(data.clothing.bodywear.breastplate._index).toBe(200)
      expect(data.clothing.headwear._index).toBe(21)
      expect(data.clothing.headwear.cap._index).toBe(210)
      expect(data.food._index).toBe(3)
    })

    describe('when used as a function', function() {
      describe('and given key', function() {
        it ('should fetch category number', function() {
          expect(data.indexOf('weapons')).toBe(1000000000000)
          expect(data.indexOf('weapons.ranged')).toBe(10000000000000)
          expect(data.indexOf('weapons.ranged.crossbow')).toBe(100000000000000)
          expect(data.indexOf('weapons.ranged.bow')).toBe(101000000000000)
          expect(data.indexOf('weapons.throwing')).toBe(11000000000000)
          expect(data.indexOf('weapons.throwing.knife')).toBe(110000000000000)
          expect(data.indexOf('weapons.melee')).toBe(12000000000000)
          expect(data.indexOf('weapons.melee.sword')).toBe(120000000000000)
          expect(data.indexOf('weapons.melee.spear')).toBe(121000000000000)
          expect(data.indexOf('clothing')).toBe(2000000000000)
          expect(data.indexOf('clothing.bodywear')).toBe(20000000000000)
          expect(data.indexOf('clothing.bodywear.breastplate')).toBe(200000000000000)
          expect(data.indexOf('clothing.headwear')).toBe(21000000000000)
          expect(data.indexOf('clothing.headwear.cap')).toBe(210000000000000)
          expect(data.indexOf('food')).toBe(3000000000000)
          expect(data.indexOf('fool')).toBe(0)
        })

        describe('and given value', function() {
          it ('should make a number that has both key and value', function() {
            expect(data.indexOf('weapons', 123)).toBe(1123000000000);
            expect(data.indexOf('weapons', -123)).toBe(-1123000000000);
            expect(data.indexOf('weapons', 12)).toBe(1012000000000);
            expect(data.indexOf('weapons', 0)).toBe(1000000000000);
            expect(data.indexOf('clothing.headwear.cap', 123)).toBe(210123000000000);
            expect(data.indexOf('clothing.headwear.cap', -123)).toBe(-210123000000000);
            expect(data.indexOf('clothing.headwear.cap', 12)).toBe(210012000000000);
            expect(data.indexOf('clothing.headwear.cap', 0)).toBe(210000000000000);
            expect(data.indexOf('food', 3)).toBe(3003000000000)
          })

          describe('and given reference', function() {
            describe('which is object', function() {
              it ('should make a reference to that object by id', function() {
                var object = {
                  id: 12345678
                }
                expect(data.indexOf('weapons', 123, Game.Reference('object', object))).toBe(1123212345678)
                expect(data.indexOf('weapons', -123, Game.Reference('object', object))).toBe(-1123212345678)
                expect(data.indexOf('weapons', 123, Game.Reference(2, object))).toBe(1123212345678)
                expect(data.indexOf('weapons', -123, Game.Reference(2, object))).toBe(-1123212345678)
              })
            })
          })
        })
      })
    })
  })
})