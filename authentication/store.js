/**
 * http://usejsdoc.org/
 */
const crypto = require('crypto')
const knex = require('knex')(require('../knexfile'))

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
			 }, 'id') //returns id in order to generate wallet
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
		  },
		  getUser(username){
			  return knex('user').where({username}).first()
		  },
		  getUserID(username) {
			  console.log(`${username}`)
			  let test = knex('user').where({username}).select('id')
			  console.log('test ' + test)
			  return knex('user').select('id').where({username}).first()
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