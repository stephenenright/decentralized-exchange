class Order {

    /**
     * @typedef {object} Order
     * Represents an order in the order book
     *
     * @property id   the id of the order
     * @property {"Open" | "Complete", "Cancelled", "Failed"} status - the type of the transaction
     * @property {"buy" | "sell"} trxType - the type of the transaction
     * @property {number} price - price for the order
     * @property {number} initialQuantity - the initial quantity / amount placed
     * @property {number} remaningQuantity - the remaining quantity left to be filled
     * @property {string} userId - userId of the user who placed the order
     * @property {string} baseCurrency - typically the currency to buy.
     * @property {string} quoteCurrency - typically the currency to sell.
     */
    // TODO ADD DATE CREATED
    constructor(id, status, trxType, price, quantity, remaningQuantity, userId, baseCurrency, quoteCurrency, version = 0) {
        this.id = id;
        this.trxType = trxType;
        this.price = price;
        this.quantity = quantity;
        this.remaningQuantity = remaningQuantity;
        this.userId = userId;
        this.baseCurrency = baseCurrency ;  // base currency
        this.quoteCurrency = quoteCurrency; // quote currency
        this.status = status
        this.version = version;
    }

    getSymbol() {
        return createSymbol(this.baseCurrency, this.quoteCurrency)
    }
}

module.exports = Order;
