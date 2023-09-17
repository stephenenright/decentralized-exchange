const {logError} = require('bfx-exchange-common/src/utils/logging');
const {logInfo} = require("../../utils/logging");

// TODO CONFIG
const timeout = 10000

/**
 * @typedef {object} TradeEngineClient
 * A trade engine client that can be executed from any node it also keeps it's own local copy of the order book
 * it updates its order book and submits the order to the trade engine for matching.
 *
 * @property {Object} rpcClient - the rpc client
 * @property {Object} clientId -  the clientId
 **/
class TradeEngineClient {

    /**
     * Creates a new TradeEngineClient
     *
     * @property {string} rpcClient the rpc client
     * @property {string} clientId  this is the clientId
     */
    constructor(rpcClient, clientId) {
        this.rpcClient = rpcClient;
        this.clientId = clientId;
    }

    submitOrder(order) {
        this.rpcClient.request('trade-engine', { action: "submit-order", order: order }, { timeout: timeout }, (err, data) => {
            if (err) {
                logError(`${this.clientId} unable to submit trade. Error: ${err}`);
                throw err;
            }
        })
    }
}


module.exports = TradeEngineClient;
