/**
 * http://usejsdoc.org/
 */
const crypto = require('crypto')

function randomString(){
	return crypto.randomBytes(4).toString('hex')
}

function getPathToFileStore(){
	return 'C:/Users/Evan/workspace/PodcastDAOPlatform/uploads/'
}

module.exports = {
		randomString,
		getPathToFileStore
	}