/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const fileupload = require("express-fileupload"); //TODO too slow for large files, update later
const podcastStore = require('./podcastStore')
const rssStore = require('../rss/rssStore')

router.use(fileupload())
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

router.get('/upload', requireLogin, (req, res) => {
	res.render('upload')
})

router.get('/podcast', requireLogin, (req, res) => {
	podcastStore.getAllPodcasts(function(podcasts){
		res.render('podcast', {
			podcasts: podcasts
		})
	})
})

router.get('/listen', requireLogin, (req, res) => {
	res.render('listen')
})

router.post('/uploadPodcast', (req, res, next) => {
	podcastStore.savePodcastToDB(req, res, {
		episode_name: req.body.episodeName, 
		description: req.body.episodeDescription,
		owner_id: req.session.user.id
	}).then(({success, id}) => {
		if(success) {
			let podcastID = id
			let rssFeedID = rssStore.getFeedID(req.session.user.id).then((rssFeedID) => {
				rssStore.saveRssMessageToDB(req, res, {
						episodeName: req.body.episodeName,
						description: req.body.episodeDescription,
						path: '/',
						owner_id: req.session.user.id,
						rssfeed_id: rssFeedID,
						podcast_id: podcastID
					}
			)})	
			res.send('Uploaded!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>')
		}
		else res.sendStatus(401)
	})
})

module.exports = router;