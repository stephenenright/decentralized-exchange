
// TODO CONFIG
const timeout = 10000

/**
 * @typedef {object} IdGeneratorClient
 * The id generator service client
 **/
class IdGeneratorClient {

    /**
     * Creates a new IdGeneratorClient
     *
     * @property {string} rpcClient the rpc client
     * @property {string} clientId  this is the clientId
     */
    constructor(rpcClient, clientId) {
        this.rpcClient = rpcClient;
        this.clientId = clientId;
    }

    generateId(cb) {
        this.rpcClient.request('id-generator', { action: "generateId", request: {"type": "order"} }, { timeout: timeout }, (err, data) => {
            cb(err,data);
        })
    }
}

module.exports = IdGeneratorClient;
