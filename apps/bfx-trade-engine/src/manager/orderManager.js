const {createSymbol} = require("bfx-exchange-common/src/orderbook/utils");
const SubmitOrderResponse = require("bfx-exchange-common/src/orderbook/models/response/SubmitOrderResponse")
const {STATUS_INVALID_REQUEST} = require("bfx-exchange-common/src/common/errors")
const OrderBook = require("../models/orderBook");
const {EVENT_TYPE_ADDED, EVENT_TYPE_UPDATED, EVENT_TYPE_DELETED} = require("bfx-exchange-common/src/common/eventTypes");

/**
 * @typedef {object} OrderManager
 * Represents class for placing orders
 *
 * @property {object} orderIdGenerator - used to generate order ids.
 * @property {Array} supportedTradeSymbol - supported trade pairs
 **/
class OrderManager {

    // TODO Add support or initializing order books from existing orders on restart
    constructor(supportedTradeSymbols, eventPublisher) {
        this.supportedTradeSymbols = new Map(supportedTradeSymbols.map(symbol => [symbol, symbol]));
        this.orderBooks = new Map(supportedTradeSymbols.map(symbol => [symbol, new OrderBook(symbol)]));
        this.eventPublisher = eventPublisher;
    }

    getOrderBooks() {
        return [...this.orderBooks.values()];
    }


    /**
     * @typedef {object} SubmitOrderRequest
     * Adds an order to the order book
     *
     * @property {object} orderIdGenerator - used to generate order ids.
     * @property {Array} supportedTradeSymbol - supported trade pairs
     **/
    // TODO ADD VALIDATIONS
    submitOrder(order) {
        const symbol = createSymbol(order.baseCurrency, order.quoteCurrency);

        if(!this.supportedTradeSymbols.has(symbol)) {
            return SubmitOrderResponse.createErrorResponse(STATUS_INVALID_REQUEST, "Trade pair is not supported");
        }

        const orderBook = this.orderBooks.get(symbol);
        if(!orderBook) {
            return SubmitOrderResponse.createErrorResponse(STATUS_INVALID_REQUEST, "Trade pair is not supported in order book");
        }

        orderBook.add(order);
        this.eventPublisher.publishOrderBookUpdated(order, EVENT_TYPE_ADDED);
        return SubmitOrderResponse.createSuccessResponse(order);
    }

    // TODO ADD VALIDATIONS
    updateOrder(order) {
        const symbol = createSymbol(order.baseCurrency, order.quoteCurrency);

        if(!this.supportedTradeSymbols.has(symbol)) {
            return false;
        }

        const orderBook = this.orderBooks.get(symbol);
        if(!orderBook) {
            return false;
        }


        orderBook.update(order);
        this.eventPublisher.publishOrderBookUpdated(order, EVENT_TYPE_UPDATED);
        return true;
    }

    removeOrder(order) {
        const symbol = createSymbol(order.baseCurrency, order.quoteCurrency);

        if(!this.supportedTradeSymbols.has(symbol)) {
            return false;
        }

        const orderBook = this.orderBooks.get(symbol);
        if(!orderBook) {
           return false;
        }


        orderBook.remove(order);
        this.eventPublisher.publishOrderBookUpdated(order, EVENT_TYPE_DELETED);
        return true;
    }
}

module.exports = OrderManager;
