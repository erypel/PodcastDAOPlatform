/**
 * This is the routes file
 */
const express = require('express')
const router = express.Router()
const session = require('client-sessions')
const bodyParser = require('body-parser')
const userStore = require('./authentication/store')

router.use(express.static('authentication'))
router.use(bodyParser.json())

//DUPLICATE

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  next();
});

router.use(session({
	cookieName: 'session',
	secret: userStore.randomString(),
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

/**
 * check if a user is logged in and redirect them if they're not
 * @param req
 * @param res
 * @param next
 * @returns
 */
function requireLogin (req, res, next) {
	console.log("login required")
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

//END DUPLICATE

router.get('/', function(req, res) {
	res.render("login")
})

router.get('/dashboard', requireLogin, function(req, res) {
	//TODO bug where user logs out and can navigate back to dashboard with back button
	res.render('dashboard')
})

module.exports = router;