/**
 * A Very simple id generator, this will could be replaced with one of the following options in production
 *  - ulid
 *  - time ordered id such provided by persistence mechanism such as ObjectId in mongo (distributed) sequence postgres)
 *  - custom id generator like twitter snowflake.
 */
class IdGenerator {

    constructor(startId = 0) {
        this.id = startId || 0;
    }

    nextId() {
        this.id += 1;
        return id;
    }
}

module.exports = IdGenerator;