Game.merge('actions', {
  modes: {
    rest: {},
    sleep: {},
    search: {
      set: function(type) {

      }
    },
    defend: {},
    flee: {},
    'return': {}
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