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
// Password topologies:
	// 		Ban commonly used password topologies
	//		Force multiple users to use different password topologies
	//		Require a minimum toplology change between old and new passwords
	
router.post('/createUser', (req, res) => {
	let password = req.body.password
	// Validate password is sufficiently secure
	let validPassword = userStore.validatePassword(password)
	let username = req.body.username
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
					password: password
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

router.post('/login', (req, res) => {
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