'use strict';
var CryptoJS = require("crypto-js");

class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
}

var blockchain = [new Block(0, "0", 1465154705, "my genesis block!!", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7")];


module.exports = {

    getBlockchain() {
        return this.blockchain;
    },

    addBlock(newBlock) {
        if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
            blockchain.push(newBlock);
        }
    },

    isValidNewBlock(newBlock, previousBlock) {
        if (previousBlock.index + 1 != newBlock.index) {
            sails.log.warn('previousBlock.index=' + previousBlock.index + ', newBlock.index=' + newBlock.index);
            return false
        }

        if (previousBlock.hash != newBlock.previousHash) {
            sails.log.warn('previousBlock.hash=' + previousBlock.hash +
                ', newBlock.previousHash=' + newBlock.previousHash);
            return false
        }

        if (calculateHashForBlock(newBlock) != newBlock.hash) {
            sails.log.warn('calculateHashForBlock(newBlock) = ' + calculateHashForBlock(newBlock)
                + ',newBlock.hash=' + newBlock.hash)
            return false
        }

        return true
    },

    generateNextBlock(blockData) {
        var previousBlock = this.getLatestBlock();
        var nextIndex = previousBlock.index + 1;
        var nextTimestamp = new Date().getTime() / 1000;
        var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
        return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
    },

    getLatestBlock() {
        return blockchain[blockchain.length - 1]
    },

    getBlockchain() {
        return blockchain
    }
}


var calculateHashForBlock = (newBlock) => calculateHash(newBlock.index, newBlock.previousHash, newBlock.timestamp, newBlock.data)

var calculateHash = (index, previousHash, nextTimestamp, data) => CryptoJS.SHA256(index + previousHash +
    nextTimestamp + data).toString()
