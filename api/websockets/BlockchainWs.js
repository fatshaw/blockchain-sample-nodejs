var MessageType = require('../services/messageType').MessageType
var WebSocket = require("ws");

var sockets = []

module.exports = {
    getPeers() {
        return sockets
    },

    async connectToPeers(newPeers) {
        newPeers.forEach(peer => {
            sails.log.info('ws peer =' + peer)
            var ws = new WebSocket(peer)
            ws.on('open', () => this.initConnection(ws))
        });
    },

    async initConnection(ws) {
        sockets.push(ws)
        initMessageHandler(ws)
        initErrorHandler(ws)
        write(ws, BlockchainResponseService.queryChainLengthMsg());
    },

    async broadcast(message) {
        broadcast(message)
    }
}

function initErrorHandler(ws) {
    var closeConnection = (ws) => {
        sails.log.info('connection failed to peer:' + ws.url)
        sockets.splice(sockets.indexOf(ws), 1)
    }
    ws.on('close', () => closeConnection(ws))
    ws.on('error', () => closeConnection(ws))
}

function initMessageHandler(ws) {
    ws.on('message', (data) => {
        var message = JSON.parse(data)
        switch (message.type) {
            case MessageType.QUERY_LATEST:
                write(ws, BlockchainResponseService.responseLatestMsg())
                break
            case MessageType.QUERY_ALL:
                write(ws, BlockchainResponseService.responseChainMsg(BlockchainService.getBlockchain()))
                break
            case MessageType.RESPONSE_BLOCKCHAIN:
                handleBlockchainResponse(message)
                break
        }
    })
}

var handleBlockchainResponse = (message) => {
    sails.log.info('handleBlockchainResponse message=' + JSON.stringify(message))
    var receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
    var latestBlockReceived = receivedBlocks[receivedBlocks.length - 1]
    var latestBlockHeld = BlockchainService.getLatestBlock()
    if (latestBlockReceived.index > latestBlockHeld.index) {
        sails.log.info('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index)
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
            BlockchainService.addBlock(latestBlockReceived)
            broadcast(JSON.stringify(BlockchainResponseService.responseLatestMsg()))
        }
    }
}

var broadcast = (message) => sockets.forEach(socket => write(socket, message))

var write = (ws, message) => ws.send(JSON.stringify(message));
