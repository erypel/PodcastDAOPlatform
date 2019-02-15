/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const fileupload = require("express-fileupload"); //TODO too slow for large files, update later
const session = require('../../authentication/session')
const adStore = require('./adStore')
const podcastStore = require('../../podcast/podcastStore')
const campaignStore = require('../adcampaign/campaignStore')
const linkStore = require('../adlink/linkStore')
const fs = require('fs')

router.use(bodyParser.json())

router.get('/uploadAd', session.requireLogin, (req, res) => {
	res.render('uploadAd')
})

router.get('/getAdCampaignStore', session.requireLogin, (req, res) => {
	campaignStore.selectAllAdCampaigns().then(campaigns => {
		adIDs = []
		console.log('campaigns', campaigns)
		// get all of the ad ids
		campaigns.forEach(function(campaign){
			adIDs.push(campaign.ad_id)
			// once we have processed all the campaigns, get all the ads
			if(adIDs.length === campaigns.length) {
				console.log('done fetching ad ids')
				adStore.selectAdsWhereInByID(adIDs).then(ads => {
					res.render('advertisement', {
						ads: ads
					})
				})
			}
		})
	})
})

router.post('/selectPodcast', session.requireLogin, (req, res) => {
	console.log(req.body)
	let advertisementID = req.body.advertisementID
	let podcastID = req.body.podcastID
	linkStore.linkAdToPodcast(advertisementID, podcastID).then(({success, id, path}) => {
		if(success) {
			res.send('Linked!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>')
		}
		else res.sendStatus(400)
	})
})

router.post('/selectAd', session.requireLogin, (req, res) => {
	let advertisementID = req.body.id
	console.log(advertisementID)
	let userID = req.session.user.id
	podcastStore.getPodcastsForUserID(userID).then((podcasts) => {
		res.render('selectPodcast', {
			advertisementID: advertisementID,
			podcasts: podcasts
		})
	})
	
})

router.post('/uploadAdFile', (req, res) => {
	adStore.saveAdToDB(req, res, {
		ad_name: req.body.adName, 
		description: req.body.adDescription, 
		owner_id: req.session.user.id
	}).then(({success, id, path}) => {
		if(success) {
			res.send('Uploaded!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>')
		}
		else res.sendStatus(400)
	})
})

module.exports = router