const {logInfo, logError} = require('bfx-exchange-common/src/utils/logging');
const SubmitOrderRequest = require('bfx-exchange-common/src/orderbook/models/request/SubmitOrderRequest');
const Order = require('bfx-exchange-common/src/orderbook/models/order');
const {ORDER_STATUS_OPEN} = require("bfx-exchange-common/src/orderbook/constants");
const OrderBook = require("bfx-trade-engine/src/models/orderBook");
const {createSymbol} = require("bfx-exchange-common/src/orderbook/utils");
const SubmitOrderResponse = require("bfx-exchange-common/src/orderbook/models/response/SubmitOrderResponse");
const {STATUS_INVALID_REQUEST} = require("bfx-exchange-common/src/common/errors");
const {EVENT_TYPE_ADDED} = require("bfx-exchange-common/src/common/eventTypes");
class OrderManager {

    constructor(supportedTradeSymbols, tradeEngineClient, idGeneratorClient) {
        this.tradeEngineClient = tradeEngineClient;
        this.ideGeneratorClient = idGeneratorClient;
        this.supportedTradeSymbols = new Map(supportedTradeSymbols.map(symbol => [symbol, symbol]));
        this.orderBooks = new Map(supportedTradeSymbols.map(symbol => [symbol, new OrderBook()]));
    }

    // TODO ADD VALIDATIONS
    submitOrder(request) {
        const symbol= createSymbol(request.baseCurrency, request.quoteCurrency);

        if(!this.supportedTradeSymbols.has(symbol)) {
            logError(`Trade pair is not supported: ${symbol}`);
            return false;
        }

        const orderBook = this.orderBooks.get(symbol);
        if(!orderBook) {
            logError(`Trade pair is not supported in order book: ${symbol}`);
            return false;
        }

        this.ideGeneratorClient.generateId((err,data) => {
            if(err || !data.status === "success") {
                logError(`Failed to generate order id, got error: ${err}`);
            } else {
                const orderId = data.id;
                const order = new Order(orderId, ORDER_STATUS_OPEN,request.trxType, request.price, request.quantity, request.quantity, request.userId, request.baseCurrency, request.quoteCurrency);
                logInfo(`Order added to local instance of order book: ${order}`)
                orderBook.add(order);
                try {
                    this.tradeEngineClient.submitOrder(order);
                } catch(e) {
                    logInfo(`Order removed from local instance of order book as submit failed: ${order}`)
                    orderBook.remove(order);
                }
            }
        })
    }

    updateOrder(order) {
        const symbol= createSymbol(order.baseCurrency, order.quoteCurrency);

        if(!this.supportedTradeSymbols.has(symbol)) {
            logError(`Trade pair is not supported, will not update local copy of order: ${JSON.stringify(order)}`);
            return false;
        }

        const orderBook = this.orderBooks.get(symbol);
        if(!orderBook) {
            logError(`Trade pair is not supported in order book, will not update local copy of order: ${JSON.stringify(order)}`);
            return false;
        }

        orderBook.update(order);

    }

    removeOrder(order) {
        const symbol= createSymbol(order.baseCurrency, order.quoteCurrency);

        if(!this.supportedTradeSymbols.has(symbol)) {
            logError(`Trade pair is not supported, will not remove local copy of order: ${JSON.stringify(order)}`);
            return false;
        }

        const orderBook = this.orderBooks.get(symbol);
        if(!orderBook) {
            logError(`Trade pair is not supported in order book, will not remove local copy of order: ${JSON.stringify(order)}`);
            return false;
        }

        orderBook.remove(order);

    }

}

module.exports = OrderManager;