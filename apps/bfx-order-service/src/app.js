const OrderManager = require('./manager/orderManager');
const OrderServer = require('./server');
const IdGeneratorClient = require('bfx-exchange-common/src/id-generator/client');
const TradeEngineClient = require('bfx-exchange-common/src/trade-engine/client/client');
const {createRpcServer,startGrape, createRpcClient} = require('bfx-exchange-common/src/rpc');

// TODO CONFIGURATION ETC.
const PORT = 3004

function startApp() {
    const tradeEngineClient =   new TradeEngineClient(createRpcClient());
    const idGeneratorClient = new IdGeneratorClient(createRpcClient());
    const orderManager = new OrderManager(tradeEngineClient, idGeneratorClient);
    const orderServer = new OrderServer(createRpcServer(PORT, "order-service"), "order-service-1", orderManager);
    orderServer.startServer();
}

// Start the simple exchange app that outputs to the command line.
startApp();
