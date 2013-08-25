Game.merge('properties', {
  personal: {
    formal: {
      name: {},
      id: {},
      age: {
        set: function() {

        }
      }
    },

    living: {
      inherit: true,
      longevity: {

      }
    },

    stats: {
      inherit: true,

      strength: {
        icon: '💪'
      },
      perception: {
        icon: '👂'
      },
      endurance: {
        icon: '✊'
      },
      charisma: {
        icon: '👏'
      },
      intelligence: {
        icon: '☝'
      },
      agility: {
        icon: '🙌'
      },
      luck: {
        icon: '👌'
      }
    },

    combat: {
      critical: {},

    },

    dimensions: {
      height: {
        unit: 'cm'
      },
      width: {
        unit: 'cm'
      },
      depth: {
        unit: 'cm'
      },
      volume: {
        unit: 'l',
        properties: ['height', 'width', 'depth'],
        set: function(value, height, width, depth) {
          if (value == null)
            value = height * width * depth / 1000;
          return value;
        }
      },
      weight: {
        unit: 'kg'
      },
      capacity: {
        unit: '%',
        of: 'volume'
      },
      durability: {
        unit: '%'
      }
    },


    measurements: {
      temperature: {
        unit: 'deg'
      },
      humidity: {
        unit: '%'
      },
      radiation: {
        light: {

        },
        radio: {

        },
        thermal: {

        }
      },
      audibility: {

      },
      smell: {

      },
      hardness: {

      },
      flexibility: {

      },
      viscocity: {

      }
    },
  },
  species: {
    eating: {
      carnivoers: {

      },
      grasseaters: {},
    },
    type: {
      flying: {},
      swimming: {}
    },
    size: {
      small: {

      }
    }
  },
  state: {
    living: {
      alive: {

      },
      concious: {

      },
      aware: {

      }
    },
    aggregate: {
      liquid: {},
      frozen: {},
      molten: {},
      burning: {},
      sparkling: {},
      boiling: {},
      evaporated: {},
      plasma: {}
    },
    sick: {
      poisoned: {},
      radiated: {},
      poisoned: {}
    },
    damage: {
      broken: {},
      corrosed: {},
      burnt: {},
      wet: {},
      dirty: {},
      sunburned: {},
      rusty: {}
    },
    precision: {
      sharp: {},
      calibrated: {},
      maintained: {}
    }
  },
  feelings: {
    psysiological: {
      hunger: {
        set: function(value, old) {
          Game.Object.increment(this, 'quests.routine.survival.feed', value - old)
        }
      },
      fatigue: {
        set: function(value, old) {
          Game.Object.increment(this, 'quests.routine.survival.rest', value - old)
        }
      },
      thirst: {},
      sleep: {},
      greathing: {},
      pain: {}
    },
    empathy: {
      sympathy: {},
      kindness: {},
      respect: {}
    },
    affection: {
      love: {},
      admiration: {},
      friendship: {},
      lust: {},
      desire: {},
      worship: {},
      need: {}
    },
    enjoyment: {
      euphoria: {},
      joy: {},
      amusement: {}
    },
    attitude: {
      hope: {},
      anticipation: {}
    },
    animation: {
      surprise: {},
      energized: {},
      concentration: {}
    },
    assurance: {
      courage: {},
      pride: {},
      confidence: {}
    },
    interest: {
      inspiration: {},
      fascination: {}
    },
    gratification: {
      relief: {},
      relaxation: {},
      satisfaction: {}
    }
  },
  relations: {
    companion: {
      spouse: {},
      lover: {},
      friend: {},
      partner: {},
      colleague: {},
      employer: {},
      employee: {}
    },
    ascendant: {
      parent: {},
      'parent-in-law': {},
      'step-parent': {}
    },
    sibling: {
      sibling: {},
      cousin: {}
    },
    descendant: {
      child: {},
      grandchild: {}
    }
  },
  existance: {
    routine: {
      occupy: {},
      live: {},
      work: {},
      eat: {}
    },
    sense: {
      see: {},
      hear: {},
      smell: {},
      touch: {}
    },
    imagine: {
      predict: {},
      expect: {},
      know: {}
    }
  },
  belonging: {
    equipment: {
      head: {
        type: ['items.wear.headwear']
      },
      'main-hand': {
        type: ['items.shield', 'items.weapon']
      },
      'off-hand': {
        type: ['items.shield', 'items.weapon']
      },
      hands: {
        type: ['items.wear.handwear']
      },
      chest: {
        type: ['items.wear.bodywear']
      },
      legs: {
        type: ['items.wear.legwear']
      },
      feet: {
        type: ['items.wear.footwear']
      }
    },
    inventory: {
      bag: {}
    }
  }
});
