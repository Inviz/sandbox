
var radius = parseInt(location.search.split('radius=')[1]) || 1;

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

    consume: {
      // input: 'Object',

      condition: function(input, output, action) {
        var target = Game.Object.References(this, function(object, kind, result) {
          var resource = Game.Object.Value(object, input);
          if (resource)
            return this;
        })
        if (target) {
          console.log('consume', target)
        }
        return target;
      },

      execute: function() {

      },

      complete: function() {

      },

      quickly: {}
    },

    gather: {
      distance: 1,
      time: 3,

      execute: function(input, output, action) {
        if (input.result.length > 1) 
          return 0;
        return (output || 0) + 1;
      },
      condition: function(input, output, action) {
        return output == 3
      },
      complete: function(input, output, action) {
        Game.Object.References(target, function(object) {
          var resource = Game.Object.Value(object, 'resources.food.plants.fruit');
          if (resource) {
            Game.Object.set(object, 'resources.food.plants.fruit', 0)
            this.push(
              Game.Value('properties.belonging.inventory.bag', 1, 'object', 
                Game('items.organic.plants.berry', 
                  Game.Value('resources.food.plants.fruit', resource)
                )
              )
            )
          }
        }, this)
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
    // check if location matches search query
    evaluate: function(input, output, action, node, distance, meta) {
      output.result[meta || 0] = node;
      if (Game.Object.Value(node, input || 'resources.food.plants.fruit') != null) {
        //console.log('fruit at', node[0])
        return -Infinity;
      }
    },
    // launch search, possibly on miltiple zoom levels
    execute: function(input, output, action) {
      return Game.Object.Path(this, function(node, distance, meta, output) {
        return action.evaluate.call(this, input, output, action, node, distance, meta)
      }, action.radius, action.levels, output);
    },

    output: 'look',

    property: {
      finder: 'finder',

      quickly: {
        radius: radius,
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
      input: 'Coordinates',
      method: 'chebyshev',
      weight: 1000000,
      // evaluates cell weight and passability to find path
      evaluate: function(input, output, action, node, distance, meta) {
        var impassable = Game.Object.References(node, function(object) {
          if (Game.Object.Value(object, 'table') != null)
            return true;
        })
        if (impassable)
          return Infinity
        var distance = Game.Coordinates.Distance(node[0], input, action.method);
        if (!distance)
          return -Infinity
        return distance * action.weight;
      },
      // launch pathfinding
      execute: function(input, output, action) {
        return Game.Object.Path(this, function(node, distance, meta, output) {
          return action.evaluate.call(this, input, output, action, node, distance, meta)
        }, action.radius, null, output);
      },
      // check if the target is reached
      condition: function(input, output, action) {
        return output && !output.result.length
      },
      // fire completion callback
      complete: function() {

      },
      // cleanup garbage
      cleanup: function() {

      },

      quickly: {
        radius: 4
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
      reaction: {},
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