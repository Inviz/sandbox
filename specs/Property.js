describe("Game.Property", function() {
  it ('should pack values', function() {
    var ref = Game.Reference('data', Game.human)
    var ref2 = Game.Reference('data', Game.oak)
    expect(ref2).toNotBe(ref)
    var property = Game.Attribute(Game.age, 10, ref)
    expect(Game.Property(property).slice()).toEqual([
      Game.age,
      10,
      Game.Referenced(ref)
    ])
    expect(Game.Property(property, 5).slice()).toEqual([
      Game.age,
      5,
      Game.Referenced(ref)
    ])
    expect(Game.Property(property, null, ref2).slice()).toEqual([
      Game.age,
      10,
      Game.Referenced(ref2)
    ])
    expect(Game.Property(property, 5, ref2).slice()).toEqual([
      Game.age,
      5,
      Game.Referenced(ref2)
    ])
    var property = Game.Attribute(Game.age)
    expect(Game.Property(property).slice()).toEqual([
      Game.age,
      0
    ])
    var property = - Game.Attribute(Game.age, 5)
    expect(Game.Property(property).slice()).toEqual([
      Game.age,
      - 5
    ])
  })
})