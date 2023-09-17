const EventEmitter = require("events");

const {createPeerBroadcaster, createRpcServer,startGrape, createRpcClient} = require('bfx-exchange-common/src/rpc');
const TradeEngineServer = require('bfx-trade-engine/src/server');
const TradeEngineClient = require('bfx-exchange-common/src/trade-engine/client/client');
const IdGeneratorClient = require('bfx-exchange-common/src/id-generator/client');
const OrderServiceClient  = require('bfx-exchange-common/src/order-service/client');
const IdGeneratorServer = require('../../bfx-id-generator-service/src/server');
const OrderServer = require('bfx-order-service/src/server');
const OrderManager = require('bfx-order-service/src/manager/orderManager');
const TradeOrderManager = require('bfx-trade-engine/src/manager/orderManager');
const TradeEventPublisher = require('bfx-trade-engine/src/events/publisher');
const TradeEventConsumer = require('bfx-trade-engine/src/events/consumer');
const TradeMatchEngine =  require('bfx-trade-engine/src/manager/tradeEngine');


const BfxExchange = require('./exchange');
const {logInfo} = require("bfx-exchange-common/src/utils/logging");

function startApp() {
    // TODO make configurable, and add resilience to clients i.e. circuit breaker.
    // Start two grape servers
    logInfo("Starting Grape Servers");
    startGrape();

    const supportedTradePairs = ['BTC/USDT', 'BTC/USD'];
    const eventEmitter = new EventEmitter();
    const peerBroadcaster = createPeerBroadcaster();
    const tradeEventPublisher = new TradeEventPublisher(eventEmitter);
    const tradeEventConsumer  = new TradeEventConsumer(eventEmitter, peerBroadcaster);
    const tradeOrderManager = new TradeOrderManager(supportedTradePairs, tradeEventPublisher);
    const tradeMatchEngine = new TradeMatchEngine(tradeOrderManager);

    // this can be considered as the leader and contains the master copy of the order book. It also provides the matching engine.
    const tradeEngineInstances = [
        new TradeEngineServer(createRpcServer(3000, "trade-engine"), "trade-engine-1", tradeOrderManager, tradeEventConsumer, tradeMatchEngine),
        new TradeEngineServer(createRpcServer(3001, "trade-engine"), "trade-engine-2", tradeOrderManager, tradeEventConsumer, tradeMatchEngine)
    ];

    const idGeneratorInstances = [
        new IdGeneratorServer(createRpcServer(3002, "id-generator"), "id-generator-1")
    ]

    const tradeEngineClient = new TradeEngineClient(createRpcClient());
    const idGeneratorClient = new IdGeneratorClient(createRpcClient());

    const orderManager = new OrderManager(supportedTradePairs, tradeEngineClient,idGeneratorClient);
    const orderServerInstances = [
        new OrderServer(createRpcServer(3004, "order-service"), "order-service-1", orderManager),
        new OrderServer(createRpcServer(3005, "order-service"), "order-service-2", orderManager)
    ]

    const orderServiceClients = [
        new OrderServiceClient(createRpcClient(), 'order-service-client-1')
    ]

    const exchange = new BfxExchange(tradeEngineInstances, idGeneratorInstances, orderServerInstances, orderServiceClients);
    exchange.startExchange();
}

// Start the simple exchange app that outputs to the command line.
startApp();
