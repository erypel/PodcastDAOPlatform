/**
 * The authentication and account creation controller
 */
const express = require('express')
const router = express.Router()
const utils = require('../utils/utils')
const constants = require('../constants')
const logger = require('../utils/logger')(__filename)
const userStore = require('./userStore')
const walletStore = require('../wallet/walletStore')
const bodyParser = require('body-parser')

router.use(bodyParser.json())

router.get('/login', function(req, res) {
	res.render("login")
})

router.get('/logout', function(req, res){
	req.session.reset()
	res.redirect('/')
})

router.get('/createUser', function(req, res) {
	res.render("createUser", {
		profile: constants.CONTENT_CREATOR_USER_PROFILE
	})
})

router.get('/createAdvertiser', function(req, res) {
	res.render('createUser', {
		profile: constants.ADVERTISER_USER_PROFILE
	})
})

// TODO need to create secure password recovery: https://www.owasp.org/index.php/Forgot_Password_Cheat_Sheet
// Password topologies:
	// 		Ban commonly used password topologies
	//		Force multiple users to use different password topologies
	//		Require a minimum topology change between old and new passwords
	
router.post('/createUser', (req, res) => {
	let password = req.body.password
	// Validate password is sufficiently secure
	let validPassword = utils.validatePassword(password)
	let username = req.body.username
	let profile = req.body.profile
	// User IDs should be unique, check for uniqueness
	userStore.getUser(username).then((existingUser) => {
		if(existingUser){
			res.statusMessage = 'Username not available.'
			res.status(400).end()
		}
		else{
			//If the username is unique and has a valid password, create the user
			if(validPassword.success){
				userStore.createUser({
					username: username,
					email: req.body.email,
					password: password,
					profile: profile
				}).then((result) => {
					walletStore.createWallet(result)
					res.sendStatus(200)
				})
			}
			else{
				res.statusMessage = validPassword.message
				res.status(400).end()
			}
		}
	})
})

/*
 * Enable logging and monitoring of authentication functions to detect attacks /
 * failures on a real time basis
 * 
 * Ensure that all failures are logged and reviewed Ensure that all password
 * failures are logged and reviewed 
 */
router.post('/login', (req, res) => {
	let username = req.body.username
	let password = req.body.password
	userStore.authenticate({
		username: username,
		password: password
	}).then(({success, user, message}) => {
		if(success) {
			// set cookie with the user's info. Might want to use something else later
			logger.info(`User::${user}::successfully logged in`)
			req.session.user = user
			res.sendStatus(200)
		}
		else{
			logger.warn('Failed login attempt for username::' + username + 
					':: with password::' + password + ':: with message::' + message)
			res.statusMessage = message
			res.status(400).end()
		}
	})
})

module.exports = router;