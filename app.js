/**
 * This is the entry point to the application
 * Using nodemon to start app server
 */
const express = require('express')
const app = express()
const session = require('client-sessions')
const userStore = require('./authentication/store')
app.set('view engine', 'ejs');

//Routes
app.use(require('./routes'))
app.use(require('./authentication/routes'))
app.use(require('./podcast/routes'))
app.use(require('./rss/routes'))
app.use(require('./wallet/routes'))
app.use(require('./rippled/routes'))

app.use(function timeLog(req, res, next) {
  next();
});

app.use(session({
	cookieName: 'session',
	secret: userStore.randomString(),
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

app.listen(3000, () => {
	console.log('Server running on http://localhost:3000')
})