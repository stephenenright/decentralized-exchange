const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const logInfo = require('../utils/logging');
const {logError} = require("../utils/logging");

// TODO Configuration
const TIMEOUT = 10000

function createPeerBroadcaster(grapeNode = 'http://127.0.0.1:30001') {
    const link = new Link({grape: grapeNode})
    link.start()
    const peer = new PeerRPCClient(link, {})
    peer.init()

    return new PeerBroadcaster(peer, link);
}

class PeerBroadcaster {
    constructor(client, link) {
        this.client = client;
        this.link = link;
    }

    broadcast(toService, message) {
        process.nextTick(() => {
            this.link.lookup(toService, (err, peers) => {
                if(err) {
                    return;
                }

                peers.forEach(peer => {
                    this.client.request(toService, message, {timeout: TIMEOUT}, (err, _) => {
                    });
                });
            });
        });
    }
}

module.exports = createPeerBroadcaster;

