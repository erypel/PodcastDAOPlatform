/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const userStore = require('./store')
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
	res.render("createUser")
})

router.post('/createUser', (req, res) => {
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