/**
 * http://usejsdoc.org/
 */
const crypto = require('crypto')
const knex = require('knex')(require('./knexfile'))

module.exports = {
		saltHashPassword,
		createUser ({username, email, password}) {
			 console.log(`Add user ${username}`)
			 const {salt, hash} = saltHashPassword(password)
			 return knex('user').insert({
				 username,
				 email,
				 salt,
				 encrypted_password: hash
			 })
		}
}

// we want to store encrypted passwords in the DB
function saltHashPassword(password){
	const salt = randomString()
	const hash = crypto.createHmac('sha512', salt).update(password)
	
	return {
		salt,
		hash: hash.digest('hex')
	}
}

function randomString(){
	return crypto.randomBytes(4).toString('hex')
}