const pino = require("pino");
const logger = pino();

function logInfo(message) {
    logger.info(message);
}

function logError(message) {
    logger.error(message)
}

module.exports = {
    logInfo,
    logError
}
