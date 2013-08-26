Game.merge('actions', {
  modes: {
    rest: {},
    sleep: {},


    defend: {},
    'return': {}
  },

  rest: {

  },

  process: {
    output: 'channeling',

    gather: {
      execute: function(argument, output, quest) {
        if (argument.result.length != 1) 
          return 0;
        return (output || 0) + 1;
      },
      condition: function(argument, output, quest) {
        return output == 3
      },
      complete: function(argument, output, quest) {
        var subject = this;
        Game.Object.each(argument.result[0], function(object) {
          var resource = Game.Object.get(object, 'resources.food.plants.fruit');
          if (resource) {
            Game.Object.set(object, 'resources.food.plants.fruit', 0)
            console.log(
                Game('items.organic.plants.berry', 
                  Game.valueOf('resources.food.plants.fruit', resource)
                )
              )
            subject.push(
              Game.valueOf('properties.belonging.inventory.bag', 1, 'object', 
                Game('items.organic.plants.berry', 
                  Game.valueOf('resources.food.plants.fruit', resource)
                )
              )
            )
          }
        })
      },

      quickly: {

      }
    },

    mine: {

    },

    cut: {

    }
  },
  
  search: {
    execute: function(argument, output, quest) {
      return Game.Object.walk(this, function(node, distance, meta, output) {
        return this[quest.finder](argument, node, distance, meta, output)
      }, quest.radius, quest.levels, output);
    },

    output: 'look',

    levels: 4,

    property: {
      finder: 'finder',

      quickly: {
        radius: 1,
        levels: 4
      },
      nearby: {
      },
      around: {
        radius: 15,
        levels: 1
      }
    }
  },

  navigate: {
    output: 'walk',

    around: {

    },
    away: {

    },
    there: {
      input: 'point',

      execute: function(input, output, quest) {
        var result = input.result;
        var last = result[result.length - 1]
        var finish = last[0];
        var path = Game.Object.walk(this, function(node, distance, meta, output) {
          return this[quest.finder](finish, node, distance, meta, output)
        }, quest.radius, null, output)
        path.finish = finish;
        console.log(input && input.result.slice())
        console.error('path', path && path.result.slice())  
        
        
        return path;
      },
      condition: function(input, output, quest) {
        var result = input.result;
        var finish = result[result.length - 1][0];
        if (window.$time >= 19)
          debugger
        return output && output.result.length < 1 && output.finish == finish
      },
      complete: function() {

      },
      cleanup: function() {

      },

      finder: 'walker',
      radius: 4,

      quickly: {

      }
    }
  },

  pose: {
    standing: {
      sneak: {},
      walk: {},
      run: {}
    },
    sitting: {
      sit: {},
      crouch: {},
      sneak: {}
    },
    lying: {
      lay: {},
      crawl: {}
    },
    fly: {
      jump: {},
      levitate: {},
      fly: {},
      fall: {}
    },
    swim: {
      'float': {},
      swim: {},
      dive: {}
    }
  },

  attack: {
    melee: {
      punch: {},
      kick: {},
      stab: {},
      cut: {},
      slash: {},
      smash: {}
    },
    ranged: {
      shoot: {},
      'throw': {}
    }
  },
  defence: {
    shield: {
      block: {},
      bash: {}
    },
    active: {
      evade: {}
    }
  },
  interaction: {
    communication: {
      ask: {},
      discuss: {},
      tell: {},
      advice: {}
    },
    barter: {
      request: {},
      demand: {},
      offer: {},
      counteroffer: {}
    }
  },
  crafts: {
    processing: {
      carve: {},
      engrave: {},
      enchant: {},
      sculpt: {}
    },
    engineering: {
      architecture: {}
    },
    operating: {
      drive: {},
      pilot: {}
    }
  },
  food: {
    processing: {
      mill: {},
      press: {}
    },
    farming: {
      plant: {},
      harvest: {},
      forage: {}
    },
    animals: {
      care: {},
      butch: {},
      milk: {}
    },
    producers: {
      cook: {},
      'make cheese': {}
    }
  },
  industry: {
    metal: {
      cast: {},
      smith: {},
      mint: {}
    },
    wood: {
      cut: {},
      carpent: {},
      mill: {}
    },
    rock: {
      mine: {},
      mason: {}
    },
    sand: {
      gather: {},
      'make glass': {}
    },
    organic: {
      tan: {},
      leather: {}
    },
    textile: {
      sew: {},
      weave: {}
    }
  },

  
})