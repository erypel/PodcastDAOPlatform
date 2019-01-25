/**
 * http://usejsdoc.org/
 */
const crypto = require('crypto')
const knex = require('knex')(require('../knexfile'))
const utils = require('../utils/utils')

// BEGIN UTILITY FUNCTIONS

function validatePassword(password){
	/*
	 * OWASP defines a strong password as:
	 * 
	 * 1) Password Length Minimum length should be enforced by the application
	 * Passwords shorter than 10 characters are considered weak Typical maximum
	 * password length is 128 characters Passphrases shorter than 20 characters
	 * are usually considered weak if they only consist of lower case latin
	 * characters 2) Password Complexity The application should enforce password
	 * complexity rules to discourage easy passwords Password mechanisms should
	 * allow virtually any character the user can type including spaces
	 * Passwords should be case sensitive An example of basic complexity
	 * checking would be: password must contain 3/4 of the following rules: at
	 * least 1 uppercase character (A-Z) at least 1 lowercase character (a-z) at
	 * least 1 digit (0-9) at least 1 special character at least 10 characters
	 * at most 128 characters not more than 2 identicaly characters in a row
	 * (e.g., 111 not allowed)
	 */
	
	/*
	 * This regex enforces these rules: 1) At least one uppercase english letter
	 * [A-Z] 2) At least one lowercase english letter [a-z] 3) At least one
	 * digit [0-9] 4) At least one special character [#?!@$% ^&*-] 5) Minimum
	 * length 10, maximum length 128
	 */
	let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{10,128}$/
	let result = regex.test(password)
	if(!result){
		// build error message
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

// want to prevent brute force login attempts
/*
 * If an attacker is able to guess passwords without the account becoming
 * disabled due to failed authentication attempts, the attacker has an
 * opportunity to continue with a brute force attack until the account is
 * compromised. Automating brute-force/password guessing attacks on web
 * applications is a trivial challenge. Password lockout mechanisms should be
 * employed that lock out an account if more than a preset number of
 * unsuccessful login attempts are made. Password lockout mechanisms have a
 * logical weakness. An attacker that undertakes a large number of
 * authentication attempts on known account names can produce a result that
 * locks out entire blocks of user accounts. Given that the intent of a password
 * lockout system is to protect from brute-force attacks, a sensible strategy is
 * to lockout accounts for a period of time (e.g., 20 minutes). This
 * significantly slows down attackers, while allowing the accounts to reopen
 * automatically for legitimate users.
 * 
 * Also, multi-factor authentication is a very powerful deterrent when trying to
 * prevent brute force attacks since the credentials are a moving target. When
 * multi-factor is implemented and active, account lockout may no longer be
 * necessary.
 */
function resetLockCount(user){
	return knex('user').where({id: user.id}).update({lock_count: 0})
}

function incrementLockCount(user){
	// if the user's lock count is 2, they are just about to be locked out.
	// Unlock their account after 1 minute
	if(user.lock_count === 2){
		setTimeout(function(){
			console.log('unlocking user', user)
			resetLockCount(user).then(()=>{
				console.log('user unlocked')
			})
		}, 60*1000)
	}
	return knex('user').increment('lock_count').where({id: user.id})
}

/**
 * we want to store encrypted passwords in the DB Accept a salt and only
 * generate one if none is supplied
 * 
 * @param {password:MISSING,salt:utils.randomString()}
 * @returns
 */
function saltHashPassword ({
	  password,
	  salt = utils.randomString()
	}) {
	  const hash = crypto
	    .createHmac('sha512', salt)
	    .update(password)
	  return {
	    salt,
	    hash: hash.digest('hex')
	  }
	}

function authenticate ({ username, password }) {
	username = username.toLowerCase() // username should be lower case in the
										// DB
    console.log(`Authenticating user ${username}`)
    return knex('user').where({ username })
      .then(([user]) => {
        if (!user) return { success: false, message: 'Login failed. Invalid userID or password' }
        if(user.lock_count >= 3) return { success: false, message: 'User is locked.'}
        const { hash } = saltHashPassword({
          password,
          salt: user.salt
        })
        // increment lock count if the user inputs the wrong password
        if(hash != user.encrypted_password){
        	return incrementLockCount(user).then(() => {
        		return { 
		        	success: false,
		        	message: 'Login failed. Invalid userID or password' 
		        }
        	})
        }
        else{
        	// reset lock count on a successful login
        	return resetLockCount(user).then(() =>{
        		return { 
	        		success: hash === user.encrypted_password,
	        		user: user 
	        	}
        	})
        }
      })
  }
// END UTILITY FUNCTIONS

// BEGIN CRUD FUNCTIONS
// TODO make sure we are storing passwords in a secure fashion:
// https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet
function createUser ({username, email, password}) {
	// As per OWASP recommendations, User IDs should be case insensitive, so
	// we'll store them in lower case
	 username = username.toLowerCase()
	 console.log(`Add user ${username}`)
	 const {salt, hash} = saltHashPassword({password})
	 return knex('user').insert({
		 username,
		 email,
		 salt,
		 encrypted_password: hash
	 }, 'id') // returns id in order to generate wallet
}

function getUser(username){
	  username = username.toLowerCase() // username should be lower case in the
										// DB
	  return knex('user').where({username: username}).first()
}

function getUserID(username) {
	  username = username.toLowerCase() // username should be lower case in the
										// DB
	  console.log(`${username}`)
	  let test = knex('user').where({username}).select('id')
	  console.log('test ' + test)
	  return knex('user').select('id').where({username}).first()
  }

module.exports = {
		validatePassword,
		saltHashPassword,
		createUser,
		authenticate,
		getUser,
		getUserID
}