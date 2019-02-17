/**
 * This is the routes file
 */
const express = require('express')
const router = express.Router()
const session = require('client-sessions')
const bodyParser = require('body-parser')
const userStore = require('./authentication/userStore')
const requireLogin = require('./authentication/session').requireLogin
const utils = require('./utils/utils')
const constants = require('./constants')

router.use(express.static('authentication'))
router.use(bodyParser.json())

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  next();
});

router.use(session({
	cookieName: 'session',
	secret: utils.randomString(),
	duration: 30 * 60 * 1000,//in millis, 30 minutes for now, probably want more
	activeDuration: 5 * 60 * 1000, //add 5 more minutes of session time if user interacts with page
	httpOnly: true, //prevent browser js from accessing cookies
	secure: true, //ensures cookies are only used over HTTPS
	ephemeral: true //deletes cookie when browser is closed
}))

//Session middleware
router.use(function(req, res, next) {
	//check that a session exists
	if(req.session && req.session.user){
		//TODO look for user in DB
		/*
		 * if(store.getUser(req.session.user.username)
		 * 		req.user = user;
		 * 		delete req.user.password //delete password from the session
		 * 		req.session.user = user //refresh session value
		 * 
		 * 		
		 */
		//finish processing the middleware and run the route
		req.user = req.session.user
		delete req.user.password
		delete req.user.encrypted_password
		next()
	} else {
		next()
	}
})

router.get('/', function(req, res) {
	res.render("login")
})

//TODO there is probably a more secure way to do this
router.get('/dashboard', requireLogin, function(req, res) {
	//TODO bug where user logs out and can navigate back to dashboard with back button
	if(req.session.user.profile === constants.CONTENT_CREATOR_USER_PROFILE) {
		res.render('dashboard')
	}
	else if(req.session.user.profile === constants.ADVERTISER_USER_PROFILE) {
		res.render('advertiserDashboard')
	}
	else {
		res.sendStatus(400)
	}
})

module.exports = router;