/**
 * Every XRP Ledger account has an address, which is a base58-encoding of a 
 * hash of the account's public key. XRP Ledger addresses always start with
 * the lowercase letter r.
 */
const Sequence = require('./sequence')
const crypto = require('crypto')

function Address(address){
	this.address = address
	this.sequence = new Sequence()
}

function verifyChecksum(){
	//TODO 
	return true
}

/**
 * Validates an address such that it meets these criteria:
 * 1) Between 25 and 35 characters in length
 * 2) Starts with the character 'r'
 * 3) Uses alphanumeric characters (excluding the number "0" capital letter "O", capital letter "I", and lowercase letter "l")
 * 4) Check the 4-byte checksum
 * 
 * documentation can be found here:
 * https://developers.ripple.com/basic-data-types.html#addresses
 * 
 * @param address
 * @returns true if valid
 */
function validateAddress(address){
	if(address.length < 25 || address.length > 35){
		return false
	}
	if(!address.startsWith('r')){
		return false
	}
	let regex = "^[a-hj-zA-HJ-NM-Z1-9]*$"
	let result = regex.test(address)
	if(!result){
		return false
	}
	return verifyChecksum()
}

module.exports = {
		Address,
		validateAddress
}