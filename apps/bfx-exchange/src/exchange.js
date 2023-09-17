'use strict'

const {logInfo, logError} = require('bfx-exchange-common/src/utils/logging');
const {TRX_TYPE_SELL, TRX_TYPE_BUY} = require('bfx-exchange-common/src/orderbook/constants');

/**
 * Helper class to run a simple distribute exchange.
 */
class BfxExchange {
    constructor(tradeEngineInstances, idGeneratorInstances, orderServerInstances, orderServiceClients) {
        this.tradeEngineInstances = tradeEngineInstances;
        this.idGeneratorInstances = idGeneratorInstances;
        this.orderServerInstances = orderServerInstances;
        this.orderServerClients = orderServiceClients;
    }

    startExchange() {
        logInfo("Exchange Starting");
        this._startIdGeneratorInstances()
        this._startTradeEngines();
        this._startOrderServiceInstances();
        logInfo("Exchange Started");
        let requestCount = 1;


        this.orderServerClients.forEach(orderServiceClient => {
            setInterval(() => {
                try {
                    const trxType = requestCount % 2 === 0 ? TRX_TYPE_BUY : TRX_TYPE_SELL;
                    const userId =  `user_id_${requestCount}`
                    orderServiceClient.submitOrder({trxType, price: 30000, quantity: 1, userId, baseCurrency: "BTC", quoteCurrency: "USDT"});
                    requestCount += 1;
                } catch(e) {
                    logError(`Error occurred submitting orders: ${e}`)
                }
            }, 10000);
        });
    }

    _startTradeEngines() {
        logInfo(`Starting ${this.tradeEngineInstances.length} instance(s) of the trade engine`);
        this.tradeEngineInstances.forEach(server => server.startServer())
        logInfo(`Trade Engines started`);
    }

    _startIdGeneratorInstances() {
        logInfo(`Starting ${this.idGeneratorInstances.length} instance(s) of the id generator service`);
        this.idGeneratorInstances.forEach(server => server.startServer())
        logInfo(`Id Generator Instances started`);
    }

    _startOrderServiceInstances() {
        logInfo(`Starting ${this.orderServerInstances.length} instance(s) of the order service`);
        this.orderServerInstances.forEach(server => server.startServer())
        logInfo(`Order Server Instances started`);
    }
}

module.exports = BfxExchange;
