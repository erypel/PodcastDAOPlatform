const crypto = require('crypto')
const BASE58 = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz'
const baseX = require('base-x')(BASE58)

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

/**
 * verifies that the computed checksum is the same as the checksum
 * 
 * -the checksum is the last 4 bytes of the address
 * -to compute the checksum, run sha256 twice on all the bytes except the last 4
 * @param address: and XRP address
 * @returns
 */
function verifyChecksum(address){
	let bytes = baseX.decode(address)
	let computedChecksum = bytesToHex(sha256(sha256(bytes.slice(0, -4)))).slice(0, 8) //runs sha256 twice on all the bytes except the last 4, and then returns the last 8 characters of the string representation. These 8 chars are equivalent to 4 bytes
	let checksum = bytesToHex(bytes.slice(-4)) //the last 4 bytes are the checksum
	return computedChecksum === checksum
}

module.exports = {
	verifyChecksum
}
