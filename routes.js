/**
 * This is the routes file
 */
const express = require('express')
const router = express.Router()
const store = require('./authentication/store')
const podcastStore = require('./podcast/podcastStore')
const session = require('client-sessions')
const bodyParser = require('body-parser')
const fileupload = require("express-fileupload"); //TODO too slow for large files, update later

router.use(express.static('authentication'))
router.use(express.static('podcast'))
router.use(bodyParser.json())
router.use(fileupload())


//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  next();
});

router.use(session({
	cookieName: 'session',
	secret: store.randomString(),
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
		next()
	} else {
		next()
	}
})


router.get('/', function(req, res) {
	res.render("login")
})

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

router.get('/dashboard', requireLogin, function(req, res) {
	//TODO bug where user logs out and can navigate back to dashboard with back button
	res.render('dashboard')
})

router.get('/upload', requireLogin, (req, res) => {
	res.render('upload')
})

router.post('/createUser', (req, res) => {
	store.createUser({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	}).then(() => res.sendStatus(200))
})

router.post('/login', (req, res) => {
	store.authenticate({
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

router.post('/uploadPodcast', (req, res, next) => {
	podcastStore.savePodcastToDB(req, res, {
		episode_name: req.body.episodeName, 
		description: req.body.episodeDescription,
		owner_id: req.session.user.id
	}).then(({success}) => {
		if(success) {
			res.send('Uploaded!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>')
		}
		else res.sendStatus(401)
	})
})

module.exports = router;