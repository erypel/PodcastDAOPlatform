/**
 * http://usejsdoc.org/
 */
const crypto = require('crypto')

function randomString(){
	return crypto.randomBytes(4).toString('hex')
}

function getPathToFileStore(){
	return 'http:/localhost:8080/uploads'
}

module.exports = {
		randomString,
		getPathToFileStore
	}