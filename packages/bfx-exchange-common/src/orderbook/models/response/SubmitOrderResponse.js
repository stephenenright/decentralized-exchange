const {STATUS_OK} = require("../../../common/status");

class SubmitOrderResponse {

    /**
     * @typedef {object} Order
     * Represents a request to submit an order
     * @property {number} status - the response status of the request
     * @property {string} errorMessage - message in the case of error
     * @property {object} order - the order if the response was successful
     */
    constructor(status, errorMessage, order) {
        this.status = status;
        this.errorMessage = errorMessage;
        this.order = order;
    }

    static createErrorResponse(status, errorMessage) {
        return new SubmitOrderResponse(status, errorMessage, undefined);
    }

    static createSuccessResponse(order) {
        return new SubmitOrderResponse(STATUS_OK, null, order);
    }
}

module.exports = SubmitOrderResponse;