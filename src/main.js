const { Blockchain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
	"5239e61a2131b6772875fa203f229f9a53a15574cfe8b0c74d79e832b6d7c053"
);

const myWalletAddress = myKey.getPublic("hex");

// Blockchain name: Zephyr
let zephyr = new Blockchain();

// Create tx and sign with key
const tx1 = new Transaction(myWalletAddress, "public key is this", 10);
tx1.signTransaction(myKey);
zephyr.addTransaction(tx1);

// Mine block
zephyr.minePendingTransactions(myWalletAddress);

// Create a second tx
const tx2 = new Transaction(myWalletAddress, "address1", 50);
tx2.signTransaction(myKey);
zephyr.addTransaction(tx2);

// Mine block
zephyr.minePendingTransactions(myWalletAddress);

// Balance of myWalletAddress
console.log(
	"Balance of myWalletAddress: ",
	zephyr.getBalanceOfAddress(myWalletAddress)
);

// Check if the chain is valid
console.log();
console.log("Is blockchain valid?", zephyr.isChainValid() ? "Yes." : "No.");
