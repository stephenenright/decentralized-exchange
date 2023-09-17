const Id = require('bfx-exchange-common/src/id-generator/generator');

/**
 * A Very simple id generator -- supposed to play the role of a distributed id generator for the purposes for the
 * demo but very simplistic.
 */
class IdGenerationManager {

    constructor() {
        this.idGenerators = {
            "order": new Id()
        }
    }

    /**
     * Generate an id for the given type i.e. order.
     * @param type the type to generate the id for.
     */
    async generateId(type) {
        return new Promise((resolve, reject) => {
              const generator =  this.idGenerators[type];

              if(!generator) {
                  return reject(`Id generator not supported for type: ${type}`);
              }

              return resolve(generator.nextId());
        });
    }
}

module.exports = IdGenerationManager;