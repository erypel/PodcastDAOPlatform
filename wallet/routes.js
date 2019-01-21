/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.use(bodyParser.json())

//BEGIN DUPLICATE METHODS THAT SHOULD BE CONSOLODATED WITH WHATS IN ROUTES.JS

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  next();
});

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

//END DUPLICATES

router.get('/wallet', requireLogin, (req, res) => {
	res.render('wallet')
})

module.exports = router