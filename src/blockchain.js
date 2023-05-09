const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
		this.timestamp = Date.now();
	}

	// Hashes all the fields of the transaction and returns it as a string
	calculateHash() {
		return SHA256(
			this.fromAddress + this.toAddress + this.amount + this.timestamp
		).toString();
	}

	/**
	 * Signs a tx with the given signingKey (which is an Elliptic keypair
	 * object that contains a private key). The signature is then stored inside the
	 * tx object and later stored on the blockchain.
	 */
	signTransaction(signingKey) {
		// Check if the fromAddress matches your publicKey
		if (signingKey.getPublic("hex") !== this.fromAddress)
			throw new Error("You cannot sign transactions for other wallets");

		// Calculate hash of tx, sign with key and store it inside the tx object
		const hashTx = this.calculateHash();
		const sig = signingKey.sign(hashTx, "base64");

		this.signature = sig.toDER("hex");
	}

	isValid() {
		// Mining rewards (fromAddress is null) are valid
		if (this.fromAddress === null) return true;

		if (!this.signature || this.signature.length === 0)
			throw new Error("No signature in this transaction");

		const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
		return publicKey.verify(this.calculateHash(), this.signature);
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
				JSON.stringify(this.transactions) +
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

	hasValidTransactions() {
		for (const tx of this.transactions) {
			if (!tx.isValid()) {
				return false;
			}
		}
		return true;
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
		return new Block(Date.parse("2023-05-09"), [], "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress) {
		const rewardTx = new Transaction(
			null,
			miningRewardAddress,
			this.miningReward
		);
		this.pendingTransactions.push(rewardTx);

		let block = new Block(Date.now(), this.pendingTransactions);
		block.mineBlock(this.difficulty);

		console.log("Block successfully mined");
		this.chain.push(block);

		this.pendingTransactions = [];
	}

	addTransaction(transaction) {
		// Prevent people from adding fake mining reward transaction
		if (!transaction.fromAddress || !transaction.toAddress)
			throw new Error("Transaction must have from and to addresses");

		// Verify the transaction
		if (!transaction.isValid()) throw new Error("Invalid transaction");

		this.pendingTransactions.push(transaction);
	}

	// Get balance of an address
	getBalanceOfAddress(address) {
		let balance = 0;

		for (const block of this.chain) {
			for (const trans of block.transactions) {
				if (trans.fromAddress === address) balance -= trans.amount;
				if (trans.toAddress === address) balance += trans.amount;
			}
		}
		return balance;
	}

	// Check validity of blockchain
	isChainValid() {
		// Checking Genesis block by its output with the first block of chain
		const realGenesis = JSON.stringify(this.createGenesisBlock());

		if (realGenesis !== JSON.stringify(this.chain[0])) {
			return false;
		}

		// Check the remaining blocks if hashes and signatures are correct
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const prevBlock = this.chain[(i = 1)];

			if (!currentBlock.hasValidTransactions()) return false;

			if (currentBlock.hash !== currentBlock.calculateHash())
				return false;

			if (currentBlock.prevHash !== prevBlock.hash) return false;
		}
		return true;
	}
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
