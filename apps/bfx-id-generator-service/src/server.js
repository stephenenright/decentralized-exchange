const {logInfo, logError} = require("bfx-exchange-common/src/utils/logging");
const IdGenerationManager = require('./manager/id');

class IdGeneratorServer {
    constructor(service, id) {
        this.id = id;
        this.service = service;
        this.idManager = new IdGenerationManager();
    }

    startServer() {
        // TODO Refactor responses to uses standard response status etc.
        this.service.on('request', async (rid, key, payload, handler) => {
            const {action} = payload;

            try {
                if(action === 'generateId') {
                    const id = await this._handleGenerateId(payload.request.type);
                    const responseMessage = {
                        status: "success",
                        id
                    }

                    handler.reply(null, responseMessage)
                } else {
                    logInfo(`ID Generator service received unsupported request: ${key}`)
                    handler.reply(null, {
                        status: "error",
                        message: "Unsupported operation"
                    })
                }
            } catch (e) {
                logError(`Unexpected error occurred: ${e}`)
                handler.reply(null, {
                    status: "error",
                    message: e
                })
            }
        });

        logInfo(`${this.id}, Server Started`);
    }

    async _handleGenerateId(type) {
        const id = await this.idManager.generateId(type);
        logInfo(`ID generator: ${this.id} generated id: ${id}`);
        return id;
    }
}

module.exports = IdGeneratorServer;
