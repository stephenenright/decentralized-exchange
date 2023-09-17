const {ErrorInvalidParameter} = require('bfx-exchange-common/src/common/errors');
const {TRX_TYPE_SELL} = require('bfx-exchange-common/src/orderbook/constants')
const {logError} = require("bfx-exchange-common/src/utils/logging");

/**
 * This is a simple class for managing an order book.
 * We don't currently do any sorting here are maintain collections in sorted in order as there is currently no requirement
 */
class OrderBook {
    constructor(symbol = undefined) {
        this.symbol = symbol;
        this.bids = {}; // buys
        this.asks = {} // asks
    }

    getSymbol() {
        return this.symbol;
    }

    add(order) {
        if(!order.id) {
            throw new ErrorInvalidParameter("Order.id is required");
        }

        const orders = this._getCollectionToUpdate(order);

        if(!orders) {
            return false;
        }

        if(orders[order.id]) {
            logError(`Ignoring adding order: ${order.id} previously added`);
            return false;
        }

        orders[order.id] = order;
        return true;
    }

    findOrderById(id) {
        return this.asks[id] || this.bids[id];
    }

    update(order) {
        const foundOrder = this.findOrderById(order.id);

        if(!foundOrder) {
            return false;
        }

        const orders = this._getCollectionToUpdate(order);

        if(order.version > foundOrder.version) {
            orders[order.id] = order;
            return true;
        }

        return false;
    }

    remove(order) {
        const foundOrder = this.findOrderById(order.id);

        if(!foundOrder) {
            return false;
        }

        const orders = this._getCollectionToUpdate(order);

        if(order.version >= foundOrder.version) {
            orders[order.id] = null;
            return true;
        }

        return false;
    }

    _getCollectionToUpdate(order) {
        return order.trxType === TRX_TYPE_SELL ? this.asks : this.bids;
    }
}

module.exports = OrderBook