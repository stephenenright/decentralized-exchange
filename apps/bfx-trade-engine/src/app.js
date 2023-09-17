const {createRpcServer,startGrape, createRpcClient, createPeerBroadcaster} = require('bfx-exchange-common/src/rpc');
const EventEmitter = require("events");
const TradeEventPublisher = require("./events/publisher");
const TradeEventConsumer = require("./events/consumer");
const TradeOrderManager = require("./manager/orderManager");
const TradeMatchEngine = require("./manager/tradeEngine");
const TradeEngineServer = require("./server");

// TODO CONFIGURATION ETC.
const PORT = 3004

function startApp() {
    const supportedTradePairs = ['BTC/USDT', 'BTC/USD'];
    const eventEmitter = new EventEmitter();
    const peerBroadcaster = createPeerBroadcaster();
    const tradeEventPublisher = new TradeEventPublisher(eventEmitter);
    const tradeEventConsumer  = new TradeEventConsumer(eventEmitter, peerBroadcaster);
    const tradeOrderManager = new TradeOrderManager(supportedTradePairs, tradeEventPublisher);
    const tradeMatchEngine = new TradeMatchEngine(tradeOrderManager);

    const server= new TradeEngineServer(createRpcServer(3000, "trade-engine"), "trade-engine-1", tradeOrderManager, tradeEventConsumer, tradeMatchEngine);
    server.startServer();
}

startApp();
