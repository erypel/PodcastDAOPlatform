/**
 * This is the controller for commenting on podcasts
 */
const express = require('express')
const session = require('../authentication/session')
const bodyParser = require('body-parser')
const router = express.Router()
const commentStore = require('./commentStore')

router.use(bodyParser.json())

router.post('/comment', session.requireLogin, (req, res) => {
	let userID = req.session.user.id
	let comment = req.body.comment //TODO obviously any user input needs to be validated
	let podcastID = req.body.podcastID
	let depth = req.body.depth > 4 ? 5 : req.body.depth // no more than 5 nesting levels
	console.log(req.body)
	//TODO implement
	let respondingTo = -1
	if(req.body.respondingTo){
		respondingTo = req.body.respondingTo
	}
	
	commentStore.insertComment({comment, respondingTo, userID, podcastID, depth}).then(function (result) {
		//TODO need some sort of check for error here
		
	})
})

module.exports = router