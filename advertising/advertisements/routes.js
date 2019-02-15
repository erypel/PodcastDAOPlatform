/**
 * The controller for advertisements
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const session = require('../../authentication/session')
const constants = require('../../constants')
// Stores:
const adStore = require('./adStore')
const podcastStore = require('../../podcast/podcastStore')
const campaignStore = require('../adcampaign/campaignStore')
const linkStore = require('../adlink/linkStore')

router.use(bodyParser.json())

router.get('/uploadAd', session.requireLogin, (req, res) => {
	res.render(constants.UPLOAD_AD_VIEW)
})

router.get('/getAdCampaignStore', session.requireLogin, (req, res) => {
	campaignStore.selectAllAdCampaigns().then(campaigns => {
		adIDs = []
		// get all of the ad ids
		campaigns.forEach(function(campaign){
			adIDs.push(campaign.ad_id)
			// once we have processed all the campaigns, get all the ads
			if(adIDs.length === campaigns.length) {
				adStore.selectAdsWhereInByID(adIDs).then(ads => {
					res.render(constants.ADVERTISEMENT_VIEW, {
						ads: ads
					})
				})
			}
		})
	})
})

router.post('/selectPodcast', session.requireLogin, (req, res) => {
	let advertisementID = req.body.advertisementID
	let podcastID = req.body.podcastID
	linkStore.linkAdToPodcast(advertisementID, podcastID).then(({success, id, path}) => {
		if(success) {
			res.send(constants.LINK_SUCCESS_MESSAGE)
		}
		else res.sendStatus(400)
	})
})

router.post('/selectAd', session.requireLogin, (req, res) => {
	let advertisementID = req.body.id
	let userID = req.session.user.id
	podcastStore.getPodcastsForUserID(userID).then((podcasts) => {
		res.render(constants.SELECT_PODCAST_VIEW, {
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
			res.send(constants.UPLOAD_SUCCESS_MESSAGE)
		}
		else res.sendStatus(400)
	})
})

module.exports = router