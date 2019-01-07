/**
 * http://usejsdoc.org/
 */
const crypto = require('crypto')
const knex = require('knex')(require('../config/knexfile'))

module.exports = {
		randomString, //put this somewhere else
		saltHashPassword,
		createUser ({username, email, password}) {
			 console.log(`Add user ${username}`)
			 const {salt, hash} = saltHashPassword({password})
			 return knex('user').insert({
				 username,
				 email,
				 salt,
				 encrypted_password: hash
			 })
		},
		authenticate ({ username, password }) {
		    console.log(`Authenticating user ${username}`)
		    return knex('user').where({ username })
		      .then(([user]) => {
		        if (!user) return { success: false }
		        const { hash } = saltHashPassword({
		          password,
		          salt: user.salt
		        })
		        return { 
		        	success: hash === user.encrypted_password,
		        	user: user 
		        }
		      })
		  }
}

/** 
 * we want to store encrypted passwords in the DB
 * Accept a salt and only generate one if none is 
 * supplied
 * 
 * @param {password:MISSING,salt:randomString()}
 * @returns
 */
function saltHashPassword ({
	  password,
	  salt = randomString()
	}) {
	  const hash = crypto
	    .createHmac('sha512', salt)
	    .update(password)
	  return {
	    salt,
	    hash: hash.digest('hex')
	  }
	}

function randomString(){
	return crypto.randomBytes(4).toString('hex')
}