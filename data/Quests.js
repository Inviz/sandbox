Game.merge('quests', {
  routine: {
    set: function(value, old, type, ref, r1, r2) {
      if (!type.actions)
        return;
      if (type.actions.call)
        type.actions = type.actions.call(type);
      var complete = 0, result;
      for (var i = 0, action; action = type.actions[i++];) {
        var t = Game.typeOf(action);
        var quest = Game[t];
        var v = value - old;
        if (v && !quest.start) {
          var o = Game.Object.get(this, t);
          if (o)
            Game.Object.increment(this, t, v, ref, r1, r2)
        }
      }
    },
    survival: {
      'feed': {
        actions: function() {
          return [
            Game.valueOf('quests.routine.acquire.outside', 3, 'resources.food'),
            Game.valueOf('quests.routine.process.cook', 2, 'resources.food'),
            Game.valueOf('quests.routine.consume.eat', 1, 'resources.food')
          ]
        }
      },
      'rest': {
        actions: function() {
          return [
            Game.valueOf('quests.routine.shelter', -1),
            Game.valueOf('quests.routine.rest',     1)
          ]
        }
      },
      'hide': {
        actions: function() {
          return [
            Game.valueOf('quests.routine.shelter',  1),
            Game.valueOf('quests.routine.rest',    -1)
          ]
        }
      }
    },
    consume: {
      eat: {

      },
      drink: {

      }
    },
    produce: {

    },
    process: {
      cook: {
        choices: function() {
          return [
            Game.valueOf('quests.routine.acquire', 1, 'fire'),
            Game.valueOf('quests.routine.goto', 1, 'kitchen')
          ]
        }
      }
    },
    shelter: {

    },
    rest: {
      sleep: {

      },
      nap: {

      },
      lie: {

      },
      sit: {

      },
      stand: {

      }
    },
    world: {
      'locate': {
        start: function(type) {
          return Game.Object.walk(this, function(node, distance, v, p, q, m) {
            return this.finder(type, node, distance, v, p, q, m)
          }, 2, 'look', 4);
        }
      },
      'navigate': {
        start: function(path) {
          var finish = path[path.length -1][0];
          return Game.Object.walk(this, function(node, distance, v, p, q, m) {
            return this.walker(finish, node, distance, v, p, q, m)
          }, 5)
        },
        complete: function() {
          debugger
        }
      },
     //'gather': {
     //  start: function(path) {
     //     
     //  }
     //},
    },
    acquire: {
      inventory: {
        get: function(type) {
          var found
          Game.Object.each(this, function(object, type) {
            if (Game.Object.get(object, type)) {
              found = object;
            }
          })
          return found;
        }
      },
      outside: {
        actions: function() {
          return [
            Game.valueOf('quests.routine.world.locate', 3),
            Game.valueOf('quests.routine.world.navigate', 2),
            Game.valueOf('quests.routine.world.gather', 1)
          ]
        }
      },
      buy: {}
    }
  },
  motives: {
    knowledge: {
      'deliver': {
        actions: ['get', 'goto', 'give']
      },
      'spy': {
        actions: ['spy']
      },
      'interview': {
        actions: ['goto', 'listen', 'goto', 'report']
      },
      'use': {
        actions: ['get', 'goto', 'use', 'goto', 'give']
      }
    },
    reputation: {
      'obtain': {
        actions: ['get', 'goto', 'give']
      },
      'kill': {
        actions: ['goto', 'kill', 'goto', 'report']
      },
      'explore': {
        actions: ['goto', 'goto', 'report']
      }
    },
    serenity: {
      'revenge': {
        actions: ['goto', 'damage']
      },
      'capture': {
        actions: ['get', 'goto', 'capture', 'goto', 'give']
      },
      'listen': {
        actions: ['goto', 'listen', 'goto', 'report']
      },
      'recover': {
        actions: ['get', 'goto', 'give']
      },
      'rescue': {
        actions: ['goto', 'damage', 'escort', 'goto', 'report']
      }
    },
    protection: {
      'uphold': {
        actions: ['goto', 'damage', 'goto', 'report']
      },
      'repair': {
        actions: ['get', 'goto', 'use'] 
      },
      'diversion': {
        actions: ['get', 'goto', 'use']
      },
      'fortify': {
        actions: ['goto', 'repair']
      },
      'guard': {
        actions: ['goto', 'defend']
      }
    },
    conquest: {
      'attack': {
        actions: ['goto', 'damage']
      },
      'steal': {
        actions: ['goto', 'steal', 'goto', 'give']
      }
    },
    wealth: {
      'gather': {
        actions: ['goto', 'get']
      },
      'make': {
        actions: ['produce']
      }
    },
    ability: {
      'assemble': {
        actions: ['repair', 'use']
      },
      'research': {
        actions: ['get', 'use']
      }
    }
  }
})