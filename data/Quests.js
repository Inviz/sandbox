Game.merge('quests', {
  routine: {
    set: function(value, old, type, ref, r1, r2) {
      if (!type.steps)
        return;
      if (type.steps.call)
        type.steps = type.steps.call(type);
      var complete = 0, result;
      for (var i = 0, action; action = type.steps[i++];) {
        var t = Game.typeOf(action);
        var quest = Game[t];
        var v = value - old;
        if (v && !quest.start) {
          if (!quest.precondition || quest.precondition.call(this)) {
            var o = Game.Object.get(this, t);
            if (o)
              Game.Object.increment(this, t, v, ref, r1, r2)
          }
        }
      }
    },
    survival: {
      'feed': {
        steps: function() {
          return [
            Game.valueOf('quests.routine.acquire.outside', 3, 'resources.food'),
            Game.valueOf('quests.routine.process.cook', 2, 'resources.food'),
            Game.valueOf('quests.routine.consume.eat', 1, 'resources.food')
          ]
        }
      },
      'rest': {
        steps: function() {
          return [
            Game.valueOf('quests.routine.shelter', -1),
            Game.valueOf('quests.routine.rest',     1)
          ]
        }
      },
      'hide': {
        steps: function() {
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
        precondition: function() {
          return Game.Object.max(this, 'creatures.animals.primates') != null;
        },
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
        steps: function() {
          return [
            Game.valueOf('actions.search.property.quickly', 3),
            Game.valueOf('actions.navigate.there.quickly', 2),
            Game.valueOf('actions.process.gather.quickly', 1)
          ]
        }
      },
      buy: {}
    }
  },
  motives: {
    knowledge: {
      'deliver': {
        steps: ['get', 'goto', 'give']
      },
      'spy': {
        steps: ['spy']
      },
      'interview': {
        steps: ['goto', 'listen', 'goto', 'report']
      },
      'use': {
        steps: ['get', 'goto', 'use', 'goto', 'give']
      }
    },
    reputation: {
      'obtain': {
        steps: ['get', 'goto', 'give']
      },
      'kill': {
        steps: ['goto', 'kill', 'goto', 'report']
      },
      'explore': {
        steps: ['goto', 'goto', 'report']
      }
    },
    serenity: {
      'revenge': {
        steps: ['goto', 'damage']
      },
      'capture': {
        steps: ['get', 'goto', 'capture', 'goto', 'give']
      },
      'listen': {
        steps: ['goto', 'listen', 'goto', 'report']
      },
      'recover': {
        steps: ['get', 'goto', 'give']
      },
      'rescue': {
        steps: ['goto', 'damage', 'escort', 'goto', 'report']
      }
    },
    protection: {
      'uphold': {
        steps: ['goto', 'damage', 'goto', 'report']
      },
      'repair': {
        steps: ['get', 'goto', 'use'] 
      },
      'diversion': {
        steps: ['get', 'goto', 'use']
      },
      'fortify': {
        steps: ['goto', 'repair']
      },
      'guard': {
        steps: ['goto', 'defend']
      }
    },
    conquest: {
      'attack': {
        steps: ['goto', 'damage']
      },
      'steal': {
        steps: ['goto', 'steal', 'goto', 'give']
      }
    },
    wealth: {
      'gather': {
        steps: ['goto', 'get']
      },
      'make': {
        steps: ['produce']
      }
    },
    ability: {
      'assemble': {
        steps: ['repair', 'use']
      },
      'research': {
        steps: ['get', 'use']
      }
    }
  }
})