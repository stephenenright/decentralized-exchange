const {logInfo, logError} = require("bfx-exchange-common/src/utils/logging");
const {P} = require("pino");
const {EVENT_TYPE_ADDED, EVENT_TYPE_UPDATED, EVENT_TYPE_DELETED} = require("bfx-exchange-common/src/common/eventTypes");

/**
 * A Simple order server use to simulate keeping the order book updated and submitting orders
 */
class OrderServer {
    constructor(service, id, orderManager) {
        this.id = id;
        this.service = service;
        this.orderManager = orderManager;
    }

    startServer() {
        // TODO Refactor responses to uses standard response status etc.
        this.service.on('request', async (rid, key, payload, handler) => {
            try {
                const {action, request} = payload;

                if(action === 'submit-order') {
                    this.orderManager.submitOrder(request)
                    const responseMessage = {
                        status: "success",
                    }

                    handler.reply(null, responseMessage)
                } else if(action === 'order-updated') {
                    this._handleOrderUpdated(payload);
                } else {
                    logInfo(`Order service received unsupported request: ${key}`)
                    handler.reply(null, {
                        status: "error",
                        message: "Unsupported operation"
                    })
                }
            } catch (e) {
                logError(`Unexpected error handling order messages: ${e}`);
            }
        });

        logInfo(`${this.id}, Server Started`);
    }

    _handleOrderUpdated(payload) {
        logInfo(`${this.id} received event to update local order book: ${JSON.stringify(payload)}`);
        const {eventType, order} = payload;

        if(eventType === EVENT_TYPE_ADDED || eventType === EVENT_TYPE_UPDATED) {
            this.orderManager.updateOrder(order);
        } else if (eventType === EVENT_TYPE_DELETED) {
            this.orderManager.removeOrder(order);
        }
    }
}

module.exports = OrderServer;