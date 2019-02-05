/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const session = require('../../authentication/session')
const adStore = require('../adStore')
const campaignStore = require('./campaignStore')

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

module.exports = router