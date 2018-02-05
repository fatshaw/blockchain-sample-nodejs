var MessageType = require('../services/messageType').MessageType

module.exports = {

    responseLatestMsg(chain) {
        return {
            'type': MessageType.RESPONSE_BLOCKCHAIN,
            'data': JSON.stringify(BlockchainService.getBlockchain())
        }
    },

    responseChainMsg(chain) {
        return {
            'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify([BlockchainService.getLatestBlock()])
        }
    },

    queryChainLengthMsg() {
        return { 'type': MessageType.QUERY_LATEST }
    }
}