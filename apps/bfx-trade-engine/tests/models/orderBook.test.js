const OrderBook = require("../../src/models/orderBook");
const Order = require("bfx-exchange-common/src/orderbook/models/order");

describe("Test the order book", () => {
    const orderBook = new OrderBook("BTC/USD");

    test('find the order by the id', () => {
        const order = new Order("1", "Pending", "Buy", 1, 30000, 1, "1",  "BTC", "USD");
        orderBook.add(order)
        const foundOrder = orderBook.findOrderById(order.id);
        expect(foundOrder.id).toBe(order.id);
    });

    test('should update order by id', () => {
        const order = new Order("1", "Pending", "Buy", 300000, 1, 1,  "BTC", "USD");
        orderBook.add(order)
        order.remaningQuantity = 0.5
        const updated = orderBook.update(order)
        expect(updated).toBeTruthy();
        const foundOrder = orderBook.findOrderById(order.id);
        expect(foundOrder.remaningQuantity).toBe(0.5);
    });

    test('should remove an order by id', () => {
        const order = new Order("1", "Pending", "Buy", 300000, 1, 1,  "BTC", "USD");
        orderBook.add(order)
        order.remaningQuantity = 0.5
        const removed = orderBook.remove(order);
        expect(removed).toBeTruthy();

        const foundOrder = orderBook.findOrderById(order.id);
        expect(foundOrder).toBeFalsy();
    });


});
