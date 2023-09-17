function createSymbol(baseCurrency, quoteCurrency) {
    return `${baseCurrency.toUpperCase()}/${quoteCurrency}`;
}


module.exports = {
    createSymbol
}
