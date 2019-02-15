/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const fileupload = require("express-fileupload"); //TODO too slow for large files, update later
const podcastStore = require('./podcastStore')
const rssStore = require('../rss/rssStore')
const adStore = require('../advertising/advertisements/adStore')
const session = require('../authentication/session')
const fs = require('fs')
const utils = require('../utils/utils')
const campaignStore = require('../advertising/adcampaign/campaignStore')
const walletStore = require('../wallet/walletStore')
const linkStore = require('../advertising/adlink/linkStore')
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

/*
 * Basic Flow for playing podcasts (subject to change):
 * 1) check if there is a linked advertisement
 * 		a) if there is a linked ad and there are still funds in escrow, play the ad
 * 		b) after playing the ad, debit the advertiser
 * 		c) after playing the ad, credit the content creator
 * 		d) if the escrow contract is now out, unlink the ad and remove db connections
 * 2) play the podcast
 */
/**
 * creates readstream to the requested file and pipes the output to response
 * 
 * @param req
 * @param res
 * @returns
 */ 
router.get('/play', function(req, res) {
	let podcastID = req.query.id

	//TODO avoid getting super nested
	// check if there is a linked ad
	let ad_ID = linkStore.getLinkedAdID(podcastID).then(result => {
		console.log("adID", result)
		if(result && result[0]){
			// TODO there should only be one linked ad allowed. I'm sure the logic for
			// that isn't in place yet, but for now we will assume it is and will 
			// compensate but just using the first row returned
			let ad = adStore.selectAdByID(result[0].ad_ID).then(ad => {
				console.log('ad', ad[0])
				//check to make sure that there are still funds held in escrow.
				// TODO this will get tricky and we will want to place locks 
				// on funds to avoid multi-thread/concurrency issues
				campaignStore.getAdCampaignForAd(ad[0].id).then(campaign => {
					// TODO There should only be one campaign per ad. There is no logic to check for
					// this yet, so we just use the first row returned
					if(!campaign[0] || campaign === [] ){
						return
					}
					else{
						console.log('campaign', campaign[0])
						let pricePerView = campaign[0].pay_per_view
						if(Number(campaign[0].curr_amount) - Number(pricePerView) < 0.000000){
							//there's no need to update an advertiser's wallet if they still have some dust
							//in their escrow record since their personal wallet should not have been deducted
							//that dust

							//remove the ad campaign. there's no money left!
							campaignStore.deleteCampaign(campaign[0].id)
							//also unlink the ad from this podcast
							linkStore.removeLink(podcastID, ad[0].id)
						}
						else{
							//TODO this will have to be revamped with a 'playlist' of sorts and will be easier
							// to implement after finalizing audio playing, which will now be the next step
							console.log('the escrow has sufficient funds')
							//play the ad
							let adPath = ad[0].path
							console.log('ad path', adPath)

							res.render('play', {
								adPath: adPath,
								epPath: req.query.path,
								campaignID: campaign[0].id,
								adID: ad[0].id,
								podcastID: podcastID
							})
						}
					}
				})
			})
		}else{
			res.render('play', {
				adPath: null,
				epPath: req.query.path
			})
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