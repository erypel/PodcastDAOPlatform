/**
 * http://usejsdoc.org/
 */
const express = require('express')
const fs = require('fs')
const Feed = require('feed').Feed
const bodyParser = require('body-parser')
const rssStore = require('./rssStore')
const knex = require('knex')(require('../knexfile'))
const router = express.Router();

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

router.get('/rss', requireLogin, (req, res) => {
	res.render('rss')
})

router.post('/createRSS', (req, res, next) => {
	let xmlPath = generatePath(req.session.user.id, req.body.title)
	
	//TODO there is probably a more elegant way to do this
	let explicit = req.body.explicit
	if(explicit == 'on')
		explicit = true
	else if(explicit == 'off')
		explicit = false
		
	generateXML({
		title: req.body.title, 
		description: req.body.description,
		language: req.body.language,
		copyright: req.body.copyright,
		explicit: explicit,
		path: xmlPath,
		owner_id: req.session.user.id
	})
	rssStore.saveToDB(req, res, {
		title: req.body.title, 
		description: req.body.description,
		language: req.body.language,
		copyright: req.body.copyright,
		explicit: explicit,
		path: xmlPath,
		owner_id: req.session.user.id
	}).then(({success}) => {
		if(success) {
			res.send('Success!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>')
		}
		else res.sendStatus(401)
	})
})

//TODO move
function generateXML(data)
{
	//This is the minimum required amount of data for an RSS field
	//TODO may consider adding additional fields
	let feed = new Feed({
		title: data.title,
		link: data.path, //TODO need to think about this
		description: data.description
	})
	
	let rssdoc = feed.rss2()
	fs.writeFile(data.path, rssdoc, function(err) {
		if(err) return console.log(err)
	})
}

//TODO move
function generatePath(userID, title){
	return './rssfeedxml/' + userID + '.xml'
}

module.exports = router;