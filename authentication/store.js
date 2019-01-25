/**
 * http://usejsdoc.org/
 */
const crypto = require('crypto')
const knex = require('knex')(require('../knexfile'))

function validatePassword(password){
	/*
	 * OWASP defines a strong password as:
	 * 
	 * 1) Password Length
	 * 		Minimum length should be enforced by the application
	 * 		Passwords shorter than 10 characters are considered weak
	 * 		Typical maximum password length is 128 characters
	 * 		Passphrases shorter than 20 characters are usually considered weak if they only consist of lower case latin characters
	 * 2) Password Complexity
	 * 		The application should enforce password complexity rules to discourage easy passwords
	 * 		Password mechanisms should allow virtually any character the user can type including spaces
	 * 		Passwords should be case sensitive
	 * 		An example of basic complexity checking would be:
	 * 			password must contain 3/4 of the following rules:
	 * 				at least 1 uppercase character (A-Z)
	 * 				at least 1 lowercase character (a-z)
	 * 				at least 1 digit (0-9)
	 * 				at least 1 special character
	 * 			at least 10 characters
	 * 			at most 128 characters
	 * 			not more than 2 identicaly characters in a row (e.g., 111 not allowed)
	 */
	
	/*
	 * This regex enforces these rules:
	 * 1) At least one uppercase english letter [A-Z]
	 * 2) At least one lowercase english letter [a-z]
	 * 3) At least one digit [0-9]
	 * 4) At least one special character [#?!@$% ^&*-]
	 * 5) Minimum length 10, maximum length 128
	 */
	let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{10,128}$/
	let result = regex.test(password)
	if(!result){
		//build error message
		let message = "Your password does not meet the following requirement(s):"
		let upperCaseRegex = /^.*[A-Z].*$/
		let lowerCaseRegex = /^.*[a-z].*$/ 
		let digitRegex = /^.*[0-9].*$/ 
		let specialCharRegex = /^.*[#?!@$% ^&*-].*$/ 
	    if(!upperCaseRegex.test(password)){
	    	message += ' At least one upper case english letter [A-Z].'
	    }
		if(!lowerCaseRegex.test(password)){
			message += ' At least one lower case english letter [a-z].'
		}
		if(!digitRegex.test(password)){
			message += ' At least one digit [0-9].'
		}
		if(!specialCharRegex.test(password)){
			message += ' At lease one special character [#?!@$ %^&*-].'
		}
		if(password.length < 10 || password.length > 128){
			message += ' A password length between 10 and 128 characters.'
		}
		console.log(message)
		return {success: false, message: message}
	}
	else{
		return {success: true}
	}
}

module.exports = {
		randomString, //put this somewhere else
		validatePassword,
		saltHashPassword,
		// As per OWASP recommendations, User IDs should be case insensitive, so we'll store them in lower case
		createUser ({username, email, password}) {
			 username = username.toLowerCase() // username should be lower case in the DB
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
			username = username.toLowerCase() // username should be lower case in the DB
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
			  username = username.toLowerCase() // username should be lower case in the DB
			  return knex('user').where({username: username}).first()
		  },
		  getUserID(username) {
			  username = username.toLowerCase() // username should be lower case in the DB
			  console.log(`${username}`)
			  let test = knex('user').where({username}).select('id')
			  console.log('test ' + test)
			  return knex('user').select('id').where({username}).first()
		  }
}

//TODO make sure we are storing passwords in a secure fashion: https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet

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