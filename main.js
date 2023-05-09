const SHA256 = require("crypto-js/sha256");

class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}
class Block {
	constructor(timestamp, transactions, prevHash = "") {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.prevHash = prevHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(
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
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	// First block of the blockchain (Genesis block)
	createGenesisBlock() {
		return new Block(0, "09/05/2023", "Genesis Block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress) {
		let block = new Block(Date.new(), this.pendingTransactions);
		block.mineBlock(this.difficulty);

		console.log("Block successfully mined");
		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, this.miningRewardAddress, this.miningReward),
		];
	}

	createTransaction(transaction) {
		this.pendingTransactions.push(transaction);
	}

	// Get balance of an address
	getBalanceOfAddress(address) {
		let balance = 0;

		for (const block of this.chain) {
			for (const trans of this.block) {
				if (trans.fromAddress === address) balance -= trans.amount;
				if (trans.toAddress === address) balance += trans.amount;
			}
		}
		return balance;
	}

	// Check validity of blockchain
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
