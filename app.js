/**
 * This is the entry point to the application
 * Using nodemon to start app server
 */
const express = require('express')
const bodyParser = require('body-parser')
const store = require('./authentication/store')
const session = require('client-sessions')
const app = express()
app.set('view engine', 'ejs');

app.use(express.static('authentication'))
app.use(bodyParser.json())
app.use(session({
	cookieName: 'session',
	secret: store.randomString(),
	duration: 30 * 60 * 1000,//in millis, 30 minutes for now, probably want more
	activeDuration: 5 * 60 * 1000, //add 5 more minutes of session time if user interacts with page
	httpOnly: true, //prevent browser js from accessing cookies
	secure: true, //ensures cookies are only used over HTTPS
	ephemeral: true //deletes cookie when browser is closed
}))

//Session middleware
app.use(function(req, res, next) {
	//check that a session exists
	if(req.session && req.session.user){
		//TODO look for user in DB
		/*
		 * if user is in db
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


app.get('/', function(req, res) {
	res.render("login")
})

app.get('/login', function(req, res) {
	res.render("login")
})

app.get('/logout', function(req, res){
	req.session.reset()
	res.redirect('/')
})

app.get('/createUser', function(req, res) {
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

app.get('/dashboard', requireLogin, function(req, res) {
	//TODO bug where user logs out and can navigate back to dashboard with back button
	res.render('dashboard')
})

app.post('/createUser', (req, res) => {
	store.createUser({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	}).then(() => res.sendStatus(200))
})

app.post('/login', (req, res) => {
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

app.listen(3000, () => {
	console.log('Server running on http://localhost:3000')
})