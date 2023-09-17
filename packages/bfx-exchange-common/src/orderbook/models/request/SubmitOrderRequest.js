class SubmitOrderRequest {

    /**
     * @typedef {object} Order
     * Represents a request to submit an order
     * @property {"buy" | "sell"} trxType - the type of the transaction
     * @property {number} price - price for the order
     * @property {number} quantity - the quantity / amount to be bought or sold
     * @property {string} userId - userId of the user who placed the order
     * @property {string} baseCurrency - the currency that is being sold
     * @property {string} quoteCurrency - the currency that is being bought
     */
    constructor(id, trxType, price, quantity, userId, baseCurrency, quoteCurrency) {
        this.id = id,
        this.trxType = trxType;
        this.price = price;
        this.quantity = quantity;
        this.userId = userId;
        this.baseCurrency = baseCurrency;
        this.quoteCurrency = quoteCurrency;
    }
}

module.exports = SubmitOrderRequest;
