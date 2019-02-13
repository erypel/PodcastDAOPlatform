/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const session = require('../../authentication/session')
const adStore = require('../adStore')
const campaignStore = require('./campaignStore')
const walletStore = require('../../wallet/walletStore')
const podcastStore = require('../../podcast/podcastStore')

router.get('/campaign', session.requireLogin, (req, res) => {
	let userID = req.session.user.id
	adStore.selectAdsByUserID(userID).then((ads) => {
		// You can't create a campaign if you haven't uploaded an ad yet
		if(ads.length === 0){
			res.send('You must create an ad first!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>')
			return
		}
		let dropdown = []
		let itemsProcessed = 0
		console.log('lenght', ads.length)
		ads.forEach(function(el){
			let ad = {}
			ad.name = el.ad_name
			ad.id = el.id
			dropdown.push(ad)
			itemsProcessed++
			console.log('items processed', itemsProcessed)
			if(itemsProcessed === ads.length){
				console.log('dropdown', dropdown)
				res.render('campaign', {
					ads: dropdown
				})
			}
		})
	})
})

router.post('/createCampaign', session.requireLogin, (req, res) => {
	console.log(req.body)
	let userID = req.session.user.id
	campaignStore.insertAdCampaign(req.body, userID).then(({success}) => {
		if(success) {
			res.send('Success!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>')
		}
		else res.sendStatus(400)
	})
})

router.post('/payAuthor', session.requireLogin, (req, res) => {
	let campaignID = req.body.campaignID
	let adID = req.body.adID
	let podcastID = req.body.podcastID
	
	console.log("finished!!!!!!")
	// TODO if any of these fail, they should all be rolled back
	// once the ad has finished playing, debit the advertiser and
	// escrow/campaign record
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