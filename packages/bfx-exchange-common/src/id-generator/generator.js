/**
 * A Very simple id generator, this will could be replaced with one of the following options in production
 *  - ulid
 *  - time ordered id such provided by persistence mechanism such as ObjectId in mongo (distributed) sequence postgres)
 *  - custom id generator like twitter snowflake.
 */
class IdGenerator {
    constructor(startId = 1) {
        this.id = startId || 1;
    }

    nextId() {
        const nextId = this.id;
        this.id += 1;
        return nextId;
    }
}

module.exports = IdGenerator;