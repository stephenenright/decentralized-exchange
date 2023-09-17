const {logInfo, logError} = require("bfx-exchange-common/src/utils/logging");
const {STATUS_OK} = require("bfx-exchange-common/src/common/status");

/**
 * @typedef {object} TradeEngineServer
 * Server which acts as a centralized server for matching trades and updating the order book...
 *
 * @property {string} id - a unique id to identity the service.
 * @property {string} service - the grenache rpc service.
 **/
 class TradeEngineServer {
    constructor(service, id, orderManager, tradeEventConsumer, tradeEngine) {
        this.id = id;
        this.service = service;
        this.orderManager = orderManager;
        this.tradeEventConsumer = tradeEventConsumer;
        this.tradeEngine = tradeEngine;
    }

    startServer() {
        this.tradeEventConsumer.startConsuming();

        this.service.on('request',(rid, key, payload, handler) => {
            try {
                const {action} = payload;

                if(action === 'submit-order') {
                    var response = this.orderManager.submitOrder(payload.order);

                    if(response.status === STATUS_OK) {
                        logInfo(`Trade Engine: ${this.id} added order to book successfully, Order: ${JSON.stringify(response.order)}`);
                    } else {
                        logInfo(`Trade Engine: ${this.id} failed to add order to book: Order: ${JSON.stringify(response.order)}`);
                    }

                    handler.reply(null, response)
                } else {
                    logInfo(`ID Generator service received unsupported request: ${key}`)
                    handler.reply(null, {
                        status: "error",
                        message: "Unsupported operation"
                    })
                }
            } catch(e) {
                logError(`Unexpected error occurred: ${e}`)
                handler.reply(null, {
                    status: "error",
                    message: e
                })
            }
        });

        this._startMatchingEngine();
        logInfo(`${this.id}, Server Started`);
    }

    _startMatchingEngine() {

        setInterval(() => {
            this.tradeEngine.matchTrades(this.orderManager.getOrderBooks());
        }, 20000)
    }
 }

 module.exports = TradeEngineServer;
