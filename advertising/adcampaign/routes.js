/**
 * This is the Ad Campaign Controller
 * 
 * This file contains all routing for ad campaigns
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const session = require('../../authentication/session')
const logger = require('../../logger')(__filename)
const constants = require('../../constants')
// The stores:
const adStore = require('../adStore')
const campaignStore = require('./campaignStore')
const walletStore = require('../../wallet/walletStore')
const podcastStore = require('../../podcast/podcastStore')

router.get(constants.AD_CAMPAIGN_ROUTE, session.requireLogin, (req, res) => {
	let userID = req.session.user.id
	adStore.selectAdsByUserID(userID).then((ads) => {
		// You can't create a campaign if you haven't uploaded an ad yet
		if(ads.length === 0){
			res.send(constants.CREATE_AD_FIRST)
			return
		}
		let dropdown = []
		let itemsProcessed = 0
		ads.forEach(function(el){
			let ad = {}
			ad.name = el.ad_name
			ad.id = el.id
			dropdown.push(ad)
			itemsProcessed++
			if(itemsProcessed === ads.length){
				res.render(constants.CAMPAIGN_VIEW, {
					ads: dropdown
				})
			}
		})
	})
})

router.post(constants.CREATE_AD_CAMPAIGN_ROUTE, session.requireLogin, (req, res) => {
	let userID = req.session.user.id
	campaignStore.insertAdCampaign(req.body, userID).then(({success}) => {
		if(success) {
			res.send(constants.SUCCESS_AND_RETURN_TO_DASHBOARD)
		}
		else res.sendStatus(400)
	})
})

router.post(constants.PAY_AUTHOR_ROUTE, session.requireLogin, (req, res) => {
	let campaignID = req.body.campaignID
	let adID = req.body.adID
	let podcastID = req.body.podcastID
	
	// TODO if any of these fail, they should all be rolled back
	// once the ad has finished playing, debit the advertiser and
	// escrow/campaign record
	
	//TODO avoid callback hell
	podcastStore.getUploaderID(podcastID).then(contentCreator => {
		let contentCreatorID = contentCreator[0].owner_id
		adStore.selectAdByID(adID).then(ad => {
			campaignStore.getAdCampaignForAd(adID).then(campaign => {
				console.log('campaign', campaign)
				let updatedCampaignBalance = Number(campaign[0].curr_amount) - Number(campaign[0].pay_per_view)
				campaignStore.updateCurrAmount(campaign[0].id, updatedCampaignBalance)
				let advertiserWalletBalance = walletStore.getUserBalance(ad[0].owner_id).then(advertiserWalletBalance => {
					let updatedAdvertiserBalance = Number(advertiserWalletBalance) - Number(campaign[0].pay_per_view)
					walletStore.updateUserBalance(ad[0].owner_id, updatedAdvertiserBalance).then(()=> {
						// credit the content creator
						let contentCreatorWalletBalance = walletStore.getUserBalance(contentCreatorID).then(contentCreatorWalletBalance => {
							let a = Number(contentCreatorWalletBalance)
							console.log('contentCreatorWalletBalance', contentCreatorWalletBalance)
							console.log('a', a)
							let b = Number(campaign[0].pay_per_view)
							console.log('pay per view', campaign[0].pay_per_view)
							console.log('b', b)
							let contentCreatorUpdatedBalance = a + b
							walletStore.updateUserBalance(contentCreatorID, contentCreatorUpdatedBalance).then(()=>{
								// check if there are still sufficient funds in escrow
								campaignStore.getAdCampaignForAd(ad[0].id).then(campaign => {
									// TODO There should only be one campaign per ad. There is no logic to check
									// for
									// this yet, so we just use the first row returned
									if(!campaign[0] || campaign === [] ){
										return
									}
									else{
										console.log('campaign', campaign[0])
										let pricePerView = campaign[0].pay_per_view
										// if not, remove the campaign and unlink the ad
										if(Number(campaign[0].curr_amount) - Number(pricePerView) < 0.000000){
											// there's no need to update an advertiser's wallet if they still
											// have some dust
											// in their escrow record since their personal wallet should not
											// have been deducted
											// that dust
											// remove the ad campaign. there's no money left!
											campaignStore.deleteCampaign(campaign[0].id)
											// also unlink the ad from this podcast
											adStore.removeLink(podcastID, ad[0].id)
										}
									}
								})
							})				
						})
					})		
				})
			})
		})
	})
})

module.exports = router