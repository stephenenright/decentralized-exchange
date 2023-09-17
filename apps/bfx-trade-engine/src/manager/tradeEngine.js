const {ORDER_STATUS_COMPLETE} = require("bfx-exchange-common/src/orderbook/constants");
const {logInfo} = require("bfx-exchange-common/src/utils/logging");

/**
 * Trade engine to match trades and update the order book.
 */
class TradeEngine {

    constructor(orderManager) {
        this.orderManager = orderManager;
    }

    matchTrades(orderBooks) {
        orderBooks.forEach(orderBook => {
            this._matchBook(orderBook);
        });
    }

    _matchBook(orderBook) {
        logInfo(`Match engine running for book: ${orderBook.symbol}`);


        const bids = orderBook.bids;
        const asks = orderBook.asks;

        while (!bids.isEmpty() && !asks.isEmpty()) {
            let buyOrder = bids.peek();
            let sellOrder = asks.peek();

            if (buyOrder.price >= sellOrder.price) {
                const quantityMatched = Math.min(sellOrder.remaningQuantity, sellOrder.remaningQuantity);
                if (quantityMatched === 0) {
                    buyOrder = bids.remove();
                    sellOrder = asks.remove();
                    buyOrder.remaningQuantity = 0;
                    sellOrder.remaningQuantity =0;
                } else {
                    // Update order quantities
                    buyOrder.remaningQuantity -= quantityMatched;
                    sellOrder.remaningQuantity -= quantityMatched;

                    if (buyOrder.remaningQuantity === 0) {
                        bids.remove();
                    }
                    if (sellOrder.remaningQuantity === 0) {
                        asks.remove();
                    }
                }

                this._executeTrade(buyOrder, sellOrder, quantityMatched);
                this._updateOrder(buyOrder);
                this._updateOrder(sellOrder);
            } else {
                break;
            }
        }
    }

    _executeTrade(buyOrder, sellOrder, quantity) {
        console.log(`Trade executed: for buyOrder: ${buyOrder.id} and sellOrder: ${sellOrder.id}  for quantity: ${quantity} with bid price: ${buyOrder.price} and sell price: ${sellOrder.price}`);
    }

    _updateOrder(order) {
        if(order.remaningQuantity <=0) {
            order.status = ORDER_STATUS_COMPLETE;
            this.orderManager.removeOrder(order);
            return;
        }

        this.orderManager.updateOrder(order);

    }
}

module.exports = TradeEngine;