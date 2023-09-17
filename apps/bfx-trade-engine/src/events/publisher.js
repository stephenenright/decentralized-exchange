const {EVENT_ORDER_BOOK_UPDATED} = require("../events/constants");

/**
 * @typedef {object} EventPublisher
 * Class responsible for publishing events
 *
 * @property {object} eventEmitter - The EventEmitter used for emitting events
 **/
class EventPublisher {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    publishOrderBookUpdated(order, eventType) {
        process.nextTick(() => {
            this.eventEmitter.emit(EVENT_ORDER_BOOK_UPDATED, {eventType, order});
        })
    }
}

module.exports = EventPublisher;