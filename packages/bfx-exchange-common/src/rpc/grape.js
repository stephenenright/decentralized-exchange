const Grape = require('grenache-grape').Grape

function startGrape() {
    const g = new Grape({
        //host: '127.0.0.1', // if undefined the Grape binds all interfaces
        dht_port: 20001,
        dht_bootstrap: [
            '127.0.0.1:20002'
        ],
        api_port: 30001
    })

    g.start()


    const g2 = new Grape({
        //host: '127.0.0.1', // if undefined the Grape binds all interfaces
        dht_port: 20002,
        dht_bootstrap: [
            '127.0.0.1:20001'
        ],
        api_port: 40001
    })

    g2.start()
}

module.exports = startGrape;