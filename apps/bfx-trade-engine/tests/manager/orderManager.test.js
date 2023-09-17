const OrderManager = require("../../src/manager/orderManager");
const SubmitOrderRequest = require("bfx-exchange-common/src/orderbook/models/request/SubmitOrderRequest");

describe("Should correctly submit an order", () => {
    const supportedTradePairs = ['BTC/USD', "BTC/USDT"];
    const orderManager = new OrderManager(supportedTradePairs);

    test('submits an order and adds it to the order book', () => {
        const submitOrderRequest = new SubmitOrderRequest("Buy", '30000', 2, "user_id1", "BTC", "USDT")
        const response = orderManager.submitOrder(submitOrderRequest);

        console.log(JSON.stringify(response));
    });
});
