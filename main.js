const SHA256 = require("crypto-js/sha256");

class Block {
	constructor(index, timestamp, data, prevHash = "") {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.prevHash = prevHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(
			this.index +
				this.prevHash +
				this.timestamp +
				JSON.stringify(this.data) +
				this.nonce
		).toString();
	}

	mineBlock(difficulty) {
		while (
			this.hash.substring(0, difficulty) !==
			Array(difficulty + 1).join("0")
		) {
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log("Block mined: " + this.hash);
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 5;
	}

	createGenesisBlock() {
		return new Block(0, "09/05/2023", "Genesis Block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.prevHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
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

console.log("⛏️ Mining block 1...");
zaphyr.addBlock(new Block(1, "09/05/2023", { amount: 4 }));

console.log("⛏️ Mining block 2...");
zaphyr.addBlock(new Block(2, "09/05/2023", { amount: 6 }));

// To show blockchain
console.log(JSON.stringify(zaphyr, null, 4));

// To check validity
console.log("Is Zaphyr valid?: " + zaphyr.isChainValid());
