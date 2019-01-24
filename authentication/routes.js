/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const userStore = require('./store')
const walletStore = require('../wallet/walletStore')
const bodyParser = require('body-parser')

router.use(bodyParser.json())

// TODO make sure passwords are being transmitted only over TLS: https://www.owasp.org/index.php/Transport_Layer_Protection_Cheat_Sheet

router.get('/login', function(req, res) {
	res.render("login")
})

router.get('/logout', function(req, res){
	req.session.reset()
	res.redirect('/')
})

router.get('/createUser', function(req, res) {
	res.render("createUser")
})

// TODO need to create secure password recovery: https://www.owasp.org/index.php/Forgot_Password_Cheat_Sheet

router.post('/createUser', (req, res) => {
	// As per OWASP recommendations, User IDs should be case insensitive //TODO store in db in lowercase
	
	// User IDs should be unique. //TODO check for uniqueness
	
	// Validate password is sufficiently secure
	
	// make sure that passwords are not truncated!
	
	// Password topologies:
	// 		Ban commonly used password topologies
	//		Force multiple users to use different password topologies
	//		Require a minimum toplology change between old and new passwords
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
	userStore.createUser({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	}).then((result) => {
		walletStore.createWallet(result)
		res.sendStatus(200)
		})
})

router.post('/login', (req, res) => {
	//TODO UserIDs are store in lowercase in DB. Convert username to lowercase
	userStore.authenticate({
		username: req.body.username,
		password: req.body.password
	}).then(({success, user}) => {
		if(success) {
			// set cookie with the user's info. Might want to use something else later
			req.session.user = user
			res.sendStatus(200)
		}
		else res.sendStatus(401)
	})
})

module.exports = router;