const {EVENT_ORDER_BOOK_UPDATED} = require("../events/constants");

/**
 * @typedef {object} EventConsumer
 * Class responsible for consuming events
 *
 * @property {object} eventEmitter - The EventEmitter used for emitting events
 **/
class EventConsumer {
    constructor(eventEmitter, peerBroadcaster) {
        this.eventEmitter = eventEmitter;
        this.peerBroadcaster = peerBroadcaster;
    }

    startConsuming() {
        this.eventEmitter.on(EVENT_ORDER_BOOK_UPDATED, message => {
            const eventMessage = {
                ...message,
                action: "order-updated"
            }

            this.peerBroadcaster.broadcast("order-service", eventMessage);
        });
    }
}

module.exports = EventConsumer;