/**
 * Every XRP Ledger account has an address, which is a base58-encoding of a 
 * hash of the account's public key. XRP Ledger addresses always start with
 * the lowercase letter r.
 */
const Sequence = require('./sequence')

function Address(address){
	this.address = address
	this.sequence = new Sequence()
}

module.exports = {
		Address
}