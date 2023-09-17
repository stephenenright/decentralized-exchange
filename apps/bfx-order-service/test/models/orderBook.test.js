const OrderBook = require("../../src/models/orderBook");
const Order = require("bfx-exchange-common/src/orderbook/models/order");

describe("Test the order book", () => {
    const orderBook = new OrderBook("BTC/USD");

    test('find the order by the id', () => {
        const order = new Order("20", "Pending", "Buy", 1, 30000, 1, "1", "user_1", "BTC", "USD");
        orderBook.add(order)
        const foundOrder = orderBook.findOrderById(order.id);
        expect(foundOrder.id).toBe(order.id);
    });

    test('should update order by id', () => {
        const order = new Order("1", "Pending", "Buy", 300000, 1, 1, "user_1", "BTC", "USD");
        orderBook.add(order)
        order.remaningQuantity = 0.5
        const orderToUpdate =  new Order("1", "Pending", "Buy", 300000, 1, 0.5, "user_1", "BTC", "USD", 2);
        const updated = orderBook.update(orderToUpdate)
        expect(updated).toBeTruthy();
        const foundOrder = orderBook.findOrderById(order.id);
        expect(foundOrder.remaningQuantity).toBe(0.5);
    });

    test('should remove an order by id', () => {
        const order = new Order("10", "Pending", "Buy", 300000, 1, 1, "user_1", "BTC", "USD", 3);
        orderBook.add(order)
        order.remaningQuantity = 0.5
        const orderToDelete = new Order("10", "Pending", "Buy", 300000, 1, 1, "user_1", "BTC", "USD", 4);
        const removed = orderBook.remove(orderToDelete);
        expect(removed).toBeTruthy();

        const foundOrder = orderBook.findOrderById(order.id);
        expect(foundOrder).toBeFalsy();
    });


});
