const {logError} = require('bfx-exchange-common/src/utils/logging');
const {logInfo} = require("../utils/logging");


// TODO CONFIG
const timeout = 10000

/**
 * @typedef {object} OrderServiceClient
 * The Order service client.
 **/
class OrderServiceClient {

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

    submitOrder(request) {
        this.rpcClient.request('order-service',
            { action: "submit-order", request: request }, { timeout: timeout }, (err, data) => {
            if (err) {
                logError(`${this.clientId} unable to submit order to order service. Error: ${err}`);
            }
        })
    }
}


module.exports = OrderServiceClient;
