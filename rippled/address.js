/**
 * Every XRP Ledger account has an address, which is a base58-encoding of a 
 * hash of the account's public key. XRP Ledger addresses always start with
 * the lowercase letter r.
 */
const Sequence = require('./sequence')
const crypto = require('crypto')
const BASE58 = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz'
const baseX = require('base-x')(BASE58)

function Address(address){
	this.address = address
	this.sequence = new Sequence()
}

function toHex(num){
	let hex = Math.round(num).toString(16);
    if(hex.length === 1) {
        hex = '0' + hex;
    }
    return hex;
}

function bytesToHex(bytes){
	 let hex = '';
     for(var i = 0; i < bytes.length; i++) {
         hex += toHex(bytes[i]);
     }
     return hex;
}

function sha256(bytes) {
	return crypto.createHash('sha256').update(bytes).digest()
}

function verifyChecksum(address){
	let bytes = baseX.decode(address)
	let computedChecksum = bytesToHex(sha256(sha256(bytes.slice(0, -4)))).slice(0, 8)
	let checksum = bytesToHex(bytes.slice(-4))
	return computedChecksum === checksum
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
	let regex = /^[a-km-zA-HJ-NM-Z1-9]*$/
	let result = regex.test(address)
	if(!result){
		return false
	}
	return verifyChecksum(address)
}

module.exports = {
		Address,
		validateAddress
}