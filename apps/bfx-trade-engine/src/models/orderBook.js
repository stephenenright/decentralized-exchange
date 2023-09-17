const {ErrorInvalidParameter} = require('bfx-exchange-common/src/common/errors');
const {TRX_TYPE_BUY, TRX_TYPE_SELL} = require('bfx-exchange-common/src/orderbook/constants')
const PriorityQueue = require('bfx-exchange-common/src/utils/queue');


/**
 * This is a simple class for managing an order book.
 * We don't currently do any sorting here are maintain collections in sorted in order as there is currently no requirement on the trade engine
 */
class OrderBook {

    constructor(symbol = undefined) {
        this.symbol = symbol;
        this.orders = {};
        this.bids = new PriorityQueue((a, b) => b.price - a.price); //  max heap for buys
        this.asks =  new PriorityQueue((a, b) => a.price - b.price); //  max heap for sells
    }

    getSymbol() {
        return this.symbol;
    }

    add(order) {
        if(!order.id) {
            throw new ErrorInvalidParameter("Order.id is required");
        }

        if(order.trxType === TRX_TYPE_BUY) {
            this.bids.add(order)
        } else if (order.trxType === TRX_TYPE_SELL) {
            this.asks.add(order)
        }

        this.orders[order.id] = order;
    }

    findOrderById(id) {
        return this.orders[id];
    }

    update(order) {
        const foundOrder = this.findOrderById(order.id);

        if(!foundOrder) {
            return false;
        }

        this.orders[order.id] = order;
        return true;
    }

    remove(order) {
        const foundOrder = this.findOrderById(order.id);

        if(!foundOrder) {
            return false;
        }

        this.orders[order.id] = null;
        return true;
    }
}

module.exports = OrderBook