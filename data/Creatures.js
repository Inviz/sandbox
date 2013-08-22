Game.merge('creatures', {
  animals: {
    primates: {
      human: {
        longevity: 120
      }
    },
    canine: {
      wolf: {
        carnivoer: 10,
        size: 3,
        pack: 10,
        reproductivity: 2,
        house: 'cave',
        maturing: 10
      },
      bear: {
        carnivoer: 10,
        grasseter: 'fruits',
        size: 4,
        reproductivity: 1
      }
    },
    vermin: {
      rabbit: {
        grasseter: 10,
        size: 2,
        reproductivity: 3,
        house: 'bush'
      }
    }
  },

  birds: {

  },

  insects: {

  },

  plants: {
    trees: {
      oak: {
        young: {
          'leaf': 2,
          'root': 2,
          'trunk': 1
        },
        growing: {
          'leaf': 3,
          'root': 2,
          'trunk': 3
        },
        maturing: {
          'leaf': 3,
          'trunk': 2
        },
        ripe: {
          'leaf': 3,
          'trunk': 2,
          'acorn': 2
        },
        overripe: {
          'acorn': -1,
          'trunk': 2,
          'acorn': 2
        },
        fallen: {
          'leaf': -5,
          'trunk': 3,
          'acorn': -1
        }
      }
    },
    bushes: {
      strawberry: {
        young: {
          'leaf': 2,
          'root': 2
        },
        growing: {
          'leaf': 4,
          'branch': 2,
          'root': 2
        },
        maturing: {
          'leaf': 4,
          'berry': 1,
          'branch': 1
        },
        ripe: {
          'berry': 3
        },
        overripe: {
          'berry': -2
        },
        fallen: {
          'leaves': -6,
          'berry': -4,
          'branch': -1
        }
      }
    }
  }
})