/**
 * This is the Data Access Object for the USER table
 * 
 * This store also contains methods relying on the USER table for 
 * login and authentication
 */
const knex = require('knex')(require('../knexfile'))
const utils = require('../utils/utils')
const logger = require('../logger')(__filename)
const constants = require('../constants')

//BEGIN UTILITY FUNCTIONS

//want to prevent brute force login attempts
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
	return knex(constants.USER_TABLE).where({id: user.id}).update({lock_count: 0})
}

function incrementLockCount(user){
	// if the user's lock count is 2, they are just about to be locked out.
	// Unlock their account after 1 minute
	if(user.lock_count === 2){
		setTimeout(function(){
			logger.info('Unlocking user with id ::' + user.id)
			resetLockCount(user).then(()=>{
				logger.info('User ID ::' + user.id + ':: unlocked')
			})
		}, 60*1000)
	}
	// Ensure that all account lockouts are logged and reviewed
	logger.warn(`Incrementing user::${user}::lockcount`)
	return knex(constants.USER_TABLE).increment('lock_count').where({id: user.id})
}

function authenticate ({ username, password }) {
	username = username.toLowerCase() // username should be lower case in the DB
	return knex(constants.USER_TABLE).where({ username })
	.then(([user]) => {
		if (!user) return { success: false, message: constants.LOGIN_FAILED }
		if(user.lock_count >= 3) return { success: false, message: constants.USER_IS_LOCKED}
		const { hash } = utils.saltHashPassword({
			password,
			salt: user.salt
		})
		// increment lock count if the user inputs the wrong password
		if(hash != user.encrypted_password){
			return incrementLockCount(user).then(() => {
				return { 
					success: false,
					message: constants.LOGIN_FAILED 
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
//END UTILITY FUNCTIONS

//BEGIN CRUD FUNCTIONS
//TODO make sure we are storing passwords in a secure fashion:
//https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet
function createUser ({username, email, password, profile}) {
	// As per OWASP recommendations, User IDs should be case insensitive, so
	// we'll store them in lower case
	username = username.toLowerCase()
	logger.info(`Creating user::${username} with profile::${profile}`)
	const {salt, hash} = utils.saltHashPassword({password})
	return knex(constants.USER_TABLE).insert({
		username,
		email,
		salt,
		encrypted_password: hash,
		profile: profile
	}, 'id') // returns id in order to generate wallet
}

function getUser(username){
	username = username.toLowerCase() // username should be lower case in the DB
	return knex(constants.USER_TABLE).where({username: username}).first()
}

function getUserID(username) {
	username = username.toLowerCase() // username should be lower case in the DB
	return knex(constants.USER_TABLE).select('id').where({username}).first()
}

//END CRUD FUNCTIONS

module.exports = {
		createUser,
		authenticate,
		getUser,
		getUserID
}