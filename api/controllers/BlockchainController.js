const BlockchainWs = require('../websockets/BlockchainWs')
var MessageType = require('../services/messageType')

module.exports = {

  async getBlock(req, res) {
    res.json(BlockchainService.getBlockchain())
  },

  async mineBlock(req, res) {
    try {
      var newBlock = BlockchainService.generateNextBlock(req.body);
      BlockchainService.addBlock(newBlock);
      await BlockchainWs.broadcast(BlockchainResponseService.responseLatestMsg(BlockchainService.getBlockchain()));
      sails.log.info('block added: ' + JSON.stringify(newBlock));
      res.ok(newBlock)
    } catch (error) {
      res.serverError(error)
    }
  },

  async getPeers(req, res) {
    try {
      res.send(BlockchainWs.getPeers().map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    }
    catch (error) {
      res.serverError(error)
    }
  },

  async addPeer(req, res) {
    try {
      await BlockchainWs.connectToPeers([req.body.peer]);
      res.json([req.body.peer])
    } catch (error) {
      res.serverError(error)
    }
  }
}
