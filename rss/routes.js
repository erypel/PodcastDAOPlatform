/**
 * http://usejsdoc.org/
 */
const express = require('express')
const fs = require('fs')
const Feed = require('feed').Feed
const bodyParser = require('body-parser')
const rssStore = require('./rssStore')
const rss = require('./rss')
const knex = require('knex')(require('../knexfile'))
const session = require('../authentication/session')
const router = express.Router();

router.get('/rss', session.requireLogin, (req, res) => {
	res.render('rss')
})

router.post('/createRSS', (req, res, next) => {
	let xmlPath = rss.generatePath(req.session.user.id, req.body.title)
	
	//TODO there is probably a more elegant way to do this
	let explicit = req.body.explicit
	if(explicit == 'on')
		explicit = true
	else if(explicit == 'off')
		explicit = false
		
	rss.generateXML({
		title: req.body.title, 
		description: req.body.description,
		language: req.body.language,
		copyright: req.body.copyright,
		explicit: explicit,
		path: xmlPath,
		owner_id: req.session.user.id
	})
	rssStore.saveRssFeedToDB(req, res, {
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

module.exports = router;