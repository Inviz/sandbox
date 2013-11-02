Game.merge('quests', {
  routine: {
    set: function(value, old, type, reference) {
      if (!type.actions)
        return;
      if (type.actions.call)
        type.actions = type.actions.call(type);
      var complete = 0, result;
      for (var i = 0, action; action = type.actions[i]; i++) {
        if (!type.parsed)
          type.parsed = [];
        var quest = (type.parsed[i] || (type.parsed[i] = Game.Property(action)))
        var v = value - old;
        var command = quest.type;
        if (v && !command.start) {
          if (!command.precondition || command.precondition.call(this)) {
            var o = Game.Object.Value(this, quest.type);
            if (!o)
              v += quest.value
            Game.Object.increment(this, quest.type, v, reference)
          }
        }
      }
    },

    survival: {
      feed: {
        reference: 'resources.food',

        actions: function() {
          return [
            Game.Value('quests.routine.acquire.outside', 3),
            Game.Value('quests.routine.process.cook', 2),
            Game.Value('quests.routine.consume.eat', 1)
          ]
        }
      },
      rest: {
        actions: function() {
          return [
            Game.Value('quests.routine.shelter', -1),
            Game.Value('quests.routine.rest',     1)
          ]
        }
      },
      hide: {
        actions: function() {
          return [
            Game.Value('quests.routine.shelter',  1),
            Game.Value('quests.routine.rest',    -1)
          ]
        }
      }
    },
    consume: {
      eat: {
        actions: function() {
          return [
            Game.Value('actions.process.consume.quickly', 1)
          ]
        }
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
            Game.Value('quests.routine.acquire', 1, 'fire'),
            Game.Value('quests.routine.goto', 1, 'kitchen')
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
          return Game.Object.References(this, function(object, type) {
            if (Game.Object.Value(object, type))
              return object;
          })
        }
      },
      outside: {
        actions: function() {
          return [
            Game.Value('actions.search.property.quickly', 3),
            Game.Value('actions.navigate.there.quickly', 2),
            Game.Value('actions.process.gather.quickly', 1)
          ]
        }
      },
      buy: {}
    }
  },
  motives: {
    knowledge: {
      'deliver': {
        actions: ['acquire', 'navigate', 'give']
      },
      'spy': {
        actions: ['spy']
      },
      'interview': {
        actions: ['navigate', 'listen', 'navigate', 'report']
      },
      'use': {
        actions: ['acquire', 'navigate', 'use', 'navigate', 'give']
      }
    },
    reputation: {
      'obtain': {
        actions: ['acquire', 'navigate', 'give']
      },
      'kill': {
        actions: ['navigate', 'kill', 'navigate', 'report']
      },
      'explore': {
        actions: ['navigate', 'navigate', 'report']
      }
    },
    serenity: {
      'revenge': {
        actions: ['navigate', 'damage']
      },
      'capture': {
        actions: ['acquire', 'navigate', 'capture', 'navigate', 'give']
      },
      'listen': {
        actions: ['navigate', 'listen', 'navigate', 'report']
      },
      'recover': {
        actions: ['acquire', 'navigate', 'give']
      },
      'rescue': {
        actions: ['navigate', 'damage', 'escort', 'navigate', 'report']
      }
    },
    protection: {
      'uphold': {
        actions: ['navigate', 'damage', 'navigate', 'report']
      },
      'repair': {
        actions: ['acquire', 'navigate', 'use'] 
      },
      'diversion': {
        actions: ['acquire', 'navigate', 'use']
      },
      'fortify': {
        actions: ['navigate', 'repair']
      },
      'guard': {
        actions: ['navigate', 'defend']
      }
    },
    conquest: {
      'attack': {
        actions: ['navigate', 'damage']
      },
      'steal': {
        actions: ['navigate', 'steal', 'navigate', 'give']
      }
    },
    wealth: {
      'gather': {
        actions: ['navigate', 'acquire']
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
        actions: ['acquire', 'use']
      }
    }
  }
})