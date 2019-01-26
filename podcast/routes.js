/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const fileupload = require("express-fileupload"); //TODO too slow for large files, update later
const podcastStore = require('./podcastStore')
const rssStore = require('../rss/rssStore')
const session = require('../authentication/session')
const fs = require('fs')
const utils = require('../utils/utils')

router.use(fileupload())
router.use(bodyParser.json())

router.get('/upload', session.requireLogin, (req, res) => {
	res.render('upload')
})

router.get('/podcast', session.requireLogin, (req, res) => {
	podcastStore.getAllPodcasts(function(podcasts){
		res.render('podcast', {
			podcasts: podcasts
		})
	})
})

/**
 * creates readstream to the requested file and pipes the output to response
 * 
 * @param req
 * @param res
 * @returns
 */ 
router.get('/play', function(req, res) {
	let path = utils.getPathToFileStore() + req.query.path
	console.log("file: " + path)
	fs.exists(path, function(exists){
		if(exists){
			let rstream = fs.createReadStream(path)
			rstream.pipe(res)
		}
		else {
			res.sendStatus(400)
		}
	})
})

//TODO yet to be implemented, but a good start for later
router.get('/download', (req, res) => {
	let fileId = req.query.id
	let file = '../uploads/' + fileId
	
	fs.exists(file,function(exists){
		if(exists)
		{
			res.setHeader('Content-disposition', 'attachment; filename=' + fileId);
			res.setHeader('Content-Type', 'application/audio/mpeg3')
			var rstream = fs.createReadStream(file)
			rstream.pipe(res)
		}
		else
		{
			res.sendStatus(400)
		}
	});
})

router.post('/uploadPodcast', (req, res, next) => {
	podcastStore.savePodcastToDB(req, res, {
		episode_name: req.body.episodeName, 
		description: req.body.episodeDescription,
		owner_id: req.session.user.id
	}).then(({success, id, path}) => {
		if(success) {
			let podcastID = id
			let rssFeedID = rssStore.getFeedID(req.session.user.id).then((rssFeedID) => {
				rssStore.saveRssMessageToDB(req, res, {
						episodeName: req.body.episodeName,
						description: req.body.episodeDescription,
						path: path,
						owner_id: req.session.user.id,
						rssfeed_id: rssFeedID,
						podcast_id: podcastID
					}
			)})	
			res.send('Uploaded!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>')
		}
		else res.sendStatus(400)
	})
})

module.exports = router