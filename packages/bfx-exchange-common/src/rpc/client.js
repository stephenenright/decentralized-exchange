const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

function createRpcClient(grapeNode = 'http://127.0.0.1:30001') {
    const link = new Link({grape: grapeNode})
    link.start()
    const peer = new PeerRPCClient(link, {})
    peer.init()
    return peer;
}

module.exports = createRpcClient;