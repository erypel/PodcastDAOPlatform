/**
 * http://usejsdoc.org/
 */
const crypto = require('crypto')

function randomString(){
	return crypto.randomBytes(4).toString('hex')
}

module.exports = {randomString}