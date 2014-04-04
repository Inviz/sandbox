!function() {
var style = document.createElement('style');
style.appendChild(document.createTextNode('\
canvas, img {\
    image-rendering: optimizeSpeed;             // Older versions of FF\
    image-rendering: -moz-crisp-edges;          // FF 6.0+\
    image-rendering: -webkit-optimize-contrast; // Webkit\
                                                //  (Safari now, Chrome soon)\
    image-rendering: -o-crisp-edges;            // OS X & Windows Opera (12.02+)\
    image-rendering: optimize-contrast;         // Possible future browsers.\
    -ms-interpolation-mode: nearest-neighbor;   // IE\
}'));
document.body.appendChild(style)
}()

describe('Map', function() {
  xit ('should calculate distance between a tile and a zone', function() {
    var map = new Game.Map;
    expect(map.distance(555, 1)).toBe(map.distance(555, 155))
    expect(map.distance(111, 1)).toBe(map.distance(111, 155))
  })

  xit ('should propagate properties', function() {    
    var map = new Game.Map(4);
    map.scale = 2
    var canvas = document.createElement('canvas');
    canvas.width = Math.pow(3, 4)
    canvas.height =Math.pow(3, 4);
    map.canvas = canvas;


    map(4542, Game('creatures.animals.primates.human'))
    map(5563, Game('creatures.plants.bushes.strawberry'))
    map(5595, Game('items.furniture.essensials.bed'))

    var start = 5555;
    var wall = 8855;
    for (var i = 0, now = wall; i < 60; i++) {
        map(now, Game('items.furniture.essensials.table'))
        var now = map.north(now)
    }

    var wall = 5845;
    for (var i = 0, now = wall; i < 30; i++) {
        map(now, Game('items.furniture.essensials.table'))
        var now = map.west(map.north(now))
    }





    var path = map.walk(4542, function(node, distance) {
        return this.walker(node, distance, 15563)
    })
    document.body.appendChild(map.canvas);
  })

    xit ('should have 9 maps to render world bits', function() {

        var canvas = document.createElement('canvas');
        canvas.width = 81 * 3
        canvas.height =81 * 3
        //canvas.style.width = '810px';
        //canvas.style.height = '810px';

        var world = new Game.Map(4, true);
        world.scale = 3
        world.canvas = canvas;
        world.setZone(155, function(tile, number) {

        })


        var wall = 1583555;
        for (var i = 0, now = wall; i < 70; i++) {
            world(now, Game('items.furniture.essensials.table'))
            var now = world.east(world.north(now))
        }

        world(1511111);
        world(1521111);
        world(1531111);
        world(1541111);
        world(1551111);
        world(1561111);
        world(1571111);
        world(1581111);
        world(1591111);
        expect(world.array[0].array[0][0]).toBe(1511111)
        expect(world.array[1].array[0][0]).toBe(1521111)
        expect(world.array[2].array[0][0]).toBe(1531111)
        expect(world.array[3].array[0][0]).toBe(1541111)
        expect(world.array[4].array[0][0]).toBe(1551111)
        expect(world.array[5].array[0][0]).toBe(1561111)
        expect(world.array[6].array[0][0]).toBe(1571111)
        expect(world.array[7].array[0][0]).toBe(1581111)
        expect(world.array[8].array[0][0]).toBe(1591111)
        expect(world(1591111)).toBe(world.array[8](1111))
        expect(world(1591112)).toNotBe(world.array[8](1111))
        expect(world(151111)).toBe(world.array[0].array[Math.pow(9, 4)]);
        expect(world(151112)).toBe(world.array[0].array[Math.pow(9, 4) + 1]);

        var human = Game('creatures.animals.primates.human');
        world(1595512, human)
        world(1555554, Game('items.furniture.essensials.bed'))
        world(1595512)
        world(11235554)
        //world.draw()
        console.profile(1);
        //var path = world.walk(1595512, function(node, distance) {
        //    return this.walker(1555554, node, distance)
        //})
        console.profileEnd(1);
        var center = world.array[4]
        var top = world.array[1];
        //world.setZone(152)
        expect(world.array[0].array[0][0]).toBe(1271111)
        expect(world.array[1].array[0][0]).toBe(1281111)
        expect(world.array[2].array[0][0]).toBe(1291111)
        expect(world.array[3].array[0][0]).toBe(1511111)
        expect(world.array[4].array[0][0]).toBe(1521111)
        expect(world.array[5].array[0][0]).toBe(1531111)
        expect(world.array[6].array[0][0]).toBe(1541111)
        expect(world.array[7].array[0][0]).toBe(1551111)
        expect(world.array[8].array[0][0]).toBe(1561111)
        expect(world.array[4]).toNotBe(center)
        expect(world.array[1]).toNotBe(top)
        expect(world.array[7]).toBe(center)
        expect(world.array[4]).toBe(top)
//
//
        console.profile(2);
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        Game.Time(0, world)
        //Game.Time(0, world)
        //Game.Time(0, world)
        //Game.Time(0, world)
        //Game.Time(0, world)
        //Game.Time(0, world)
        //Game.Time(0, world)
        //Game.Time(0, world)
        //Game.Time(0, world)
        //Game.Time(0, world)
        //Game.Time(0, world)
        console.profileEnd(2);
        world.draw(human);
       document.body.appendChild(world.canvas);
    })

    xit ('should be able to continue pathfinding', function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 9 //81// * 4
        canvas.height =9 //81// * 4
        canvas.imageSmoothingEnabled = false
        canvas.mozImageSmoothingEnabled = false
        canvas.webkitImageSmoothingEnabled = false
        var map = new Game.Map(2);
        map.scale = 20
        map.zone = 111
        map.z = 3;

        map.canvas = canvas;


        var rabbit = Game('creatures.animals.vermin.rabbit');
        map(11115, rabbit)


        //var rabbit2 = Game('creatures.animals.vermin.rabbit');
        //map(11173, rabbit2)

        var bush = Game('creatures.plants.bushes.strawberry',
            Game.valueOf('resources.food.plants.fruit', 10)
        );
        map(11196, bush)
        var time = 0;
        time = Game.Time(time, map)
        time = Game.Time(time, map)
        time = Game.Time(time, map)
        map.draw(rabbit);
        //window.$tick = 3;
        //console.error('tick 3')
        console.log(rabbit)
        document.body.appendChild(map.canvas);

    })



    it ('should be able to continue pathfinding', function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 81// * 4
        canvas.height =81// * 4
        canvas.imageSmoothingEnabled = false
        canvas.mozImageSmoothingEnabled = false
        canvas.webkitImageSmoothingEnabled = false
        var map = new Game.Map(4);
        map.scale = 10
        map.zone = 1111
        map.z = 4;

        map.canvas = canvas;


        var rabbit = Game('creatures.animals.vermin.rabbit');
        map(11111835, rabbit)


       //var rabbit2 = Game('creatures.animals.vermin.rabbit');
       //map(11113172, rabbit2)
       //var rabbit3 = Game('creatures.animals.vermin.rabbit');
       //map(11113173, rabbit3)
       //var rabbit4 = Game('creatures.animals.vermin.rabbit');
       //map(11113174, rabbit4)
       //var rabbit5 = Game('creatures.animals.vermin.rabbit');
       //map(11113175, rabbit5)
       //var rabbit6 = Game('creatures.animals.vermin.rabbit');
       //map(11113176, rabbit6)

        var bush = Game('creatures.plants.bushes.strawberry',
            Game.valueOf('resources.food.plants.fruit', 10)
        );
        map(11118235, bush)
        var time = 0;
        var interval = parseInt(location.search.split('interval=')[1]);
        if (interval)
            return setInterval(function() {

                time = Game.Time(time, map)
                map.draw(rabbit);
                if (!map.canvas.parentNode)
                document.body.appendChild(map.canvas);
            }, interval)
        //time = Game.Time(time, map)
        time = Game.Time(time, map)
        map.draw(rabbit);
        //window.$tick = 3;
        //console.error('tick 3')
        document.body.appendChild(map.canvas);

    })

    xit ('should do things according to hunger', function() {
        var canvas = document.createElement('canvas');
        canvas.width = Math.pow(3, 4)
        canvas.height = Math.pow(3, 4)
        console.profile(2);
        var world = new Game.Map(4);
        world.setZone(15555555)

        var viewport = new Game.Map(4, 1);
        world.viewport = viewport;
        viewport.canvas = canvas;
        viewport.setZone(155555556666, world)

        // local tiles
         expect(world(1555555566667777)).toBe(viewport.array[4](7777))
         expect(world(1555555566667777)).toBe(viewport(1555555566667777))
         expect(world(1555555566667777)[0]).toBe(1555555566667777)
         expect(world(155555556666777)).toBe(viewport.array[4](777))
         expect(world(155555556666777)).toBe(viewport(155555556666777))
         expect(world(155555556666777)[0]).toBe(155555556666777)
         expect(world(15555555666677)).toBe(viewport.array[4](77))
         expect(world(15555555666677)).toBe(viewport(15555555666677))
         expect(world(15555555666677)[0]).toBe(15555555666677)
         expect(world(1555555566667)).toBe(viewport.array[4](7))
         expect(world(1555555566667)).toBe(viewport(1555555566667))
         expect(world(1555555566667)[0]).toBe(1555555566667)

        // global tiles
        expect(world(155555556666)).toBe(world(6666))
        expect(world(155555556666)[0]).toBe(155555556666)
        expect(world(15555555666)).toBe(world(666))
        expect(world(15555555666)[0]).toBe(15555555666)
        expect(world(1555555566)).toBe(world(66))
        expect(world(1555555566)[0]).toBe(1555555566)
        expect(world(155555556)).toBe(world(6))
        expect(world(155555556)[0]).toBe(155555556)




        var rabbit = Game('creatures.animals.vermin.rabbit');
        viewport(1555555566661377, rabbit)

        var rabbit2 = Game('creatures.animals.vermin.rabbit');
        viewport(1555555566668122, rabbit2)

        var bush1 = Game('creatures.plants.bushes.strawberry',
            Game.valueOf('resources.food.plants.fruit', 10)
        );
        viewport(1555555566667777, bush1)
        var bush2 = Game('creatures.plants.bushes.strawberry',
            Game.valueOf('resources.food.plants.fruit', 10)
        );
        viewport(1555555566667477, bush2)

        expect(Game.Object.get(world(1555555566667777), 'resources.food.plants.fruit')).toBe(10)
        expect(Game.Object.get(world(155555556666777), 'resources.food.plants.fruit')).toBe(10)
        expect(Game.Object.get(world(15555555666677), 'resources.food.plants.fruit')).toBe(10)
        expect(Game.Object.get(world(1555555566667), 'resources.food.plants.fruit')).toBe(20)
        expect(Game.Object.get(world(155555556666), 'resources.food.plants.fruit')).toBe(20)
        expect(Game.Object.get(world(15555555666), 'resources.food.plants.fruit')).toBe(20)
        expect(Game.Object.get(world(1555555566), 'resources.food.plants.fruit')).toBe(20)
        expect(Game.Object.get(world(155555556), 'resources.food.plants.fruit')).toBe(20)

        time = Game.Time(time, viewport)
        expect(Game.Object.get(rabbit, 'quests.routine.survival.feed')).toBe(1)
        expect(Game.Object.get(rabbit, 'quests.routine.process.cook')).toBe(1)
        expect(Game.Object.get(rabbit, 'quests.routine.consume.eat')).toBe(2)
        expect(Game.Object.get(rabbit, 'quests.routine.acquire.outside')).toBe(3)
        expect(Game.Object.get(rabbit, 1)).toBe(world.south(1555555566661377))
        time = Game.Time(time, viewport)
        expect(Game.Object.get(rabbit, 'quests.routine.survival.feed')).toBe(2)
        expect(Game.Object.get(rabbit, 'quests.routine.process.cook')).toBe(2)
        expect(Game.Object.get(rabbit, 'quests.routine.consume.eat')).toBe(3)
        expect(Game.Object.get(rabbit, 'quests.routine.acquire.outside')).toBe(4)

        var wall = 1555555566655555;
        for (var i = 0, now = wall; i < 70; i++) {
            viewport(now, Game('items.furniture.essensials.table'))
            var now = viewport.east(viewport.north(now))
        }

        setInterval(function() {
            time = Game.Time(time, viewport)
            viewport.draw(Game.paths.walk[Game.Object.get(rabbit, 'id')])
        }, 100)


        var time = 0;
        //time = Game.Time(time, viewport)
        console.profileEnd(2);
        //console.log(viewport.objects[0], 123)
        document.body.appendChild(canvas)
    })
}); 


/*


SELECT "alive"
HOURLY
INCREMENT "hunger"

SELECT "alive"
WHERE "hunger" > "hunger_threshold"
SEARCH "food"


ON "damage"
DECREMENT "happiness"
*/