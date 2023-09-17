const {logInfo} = require("bfx-exchange-common/src/utils/logging");
const {createRpcServer} = require('bfx-exchange-common/src/rpc');
const IdGeneratorServer = require('./server');

// TODO CONFIGURATION ETC.
const PORT = 3003

function startApp() {
    const idGeneratorServer = new IdGeneratorServer(createRpcServer(PORT, "id-generator"), "id-generator-1")
    idGeneratorServer.startServer();
}

// Start the simple exchange app that outputs to the command line.
startApp();
