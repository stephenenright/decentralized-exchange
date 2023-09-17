const Link = require("grenache-nodejs-link");
const {PeerRPCServer} = require("grenache-nodejs-http");
const TradeEngineServer = require("bfx-trade-engine/src/server");
const {logInfo} = require("../utils/logging");


function createRpcServer(serverPort, serverName, grapeNode = 'http://127.0.0.1:30001') {
    const link = new Link({
        grape: 'http://127.0.0.1:30001'
    })
    link.start()

    const peer = new PeerRPCServer(link, {
        timeout: 300000
    })
    peer.init()

    const port = serverPort || 1024 + Math.floor(Math.random() * 1000);
    const service = peer.transport('server')
    logInfo(`Starting RPC server on port ${port}`);
    service.listen(port)
    link.announce(serverName, service.port, {})

    setInterval(function () {
        link.announce(serverName, service.port, {})
    }, 50000)

    return service;
}

module.exports = createRpcServer;