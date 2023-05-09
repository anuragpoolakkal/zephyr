const SHA256 = require("crypto-js/sha256");

class Block {
	constructor(index, timestamp, data, prevHash = "") {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.prevHash = prevHash;
		this.hash = this.calculateHash();
	}

	calculateHash() {
		return SHA256(
			this.index +
				this.prevHash +
				this.timestamp +
				JSON.stringify(this.data)
		).toString();
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.chain.createGenesisBlock()];
	}

	createGenesisBlock() {
		return new Block(0, "09/05/2023", "BLOCK01", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.prevHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const prevBlock = this.chain[(i = 1)];

			if (currentBlock.hash !== currentBlock.calculateHash())
				return false;

			if (currentBlock.prevHash !== prevBlock.hash) return false;
		}
		return true;
	}
}

// Blockchain name: Zaphyr
let zaphyr = new Blockchain();
zaphyr.addBlock(new Block(1, "09/05/2023", { amount: 4 }));
zaphyr.addBlock(new Block(2, "09/05/2023", { amount: 6 }));

// To show blockchain
console.log(JSON.stringify(zaphyr, null, 4));

// To check validity
console.log("Is Zaphyr valid?: " + zaphyr.isChainValid());