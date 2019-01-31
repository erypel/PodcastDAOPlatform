/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const session = require('../../authentication/session')
const adStore = require('../adStore')

router.get('/campaign', session.requireLogin, (req, res) => {
	let userID = req.session.user.id
	adStore.selectAdsByUserID(userID).then((ads) => {
		let dropdown = []
		let itemsProcessed = 0
		ads.forEach(function(el){
			let ad = {}
			ad.name = el.ad_name
			ad.id = el.id
			dropdown.push(ad)
			itemsProcessed++
			if(itemsProcessed === ads.length){
				console.log('dropdown', dropdown)
				res.render('campaign', {
					ads: dropdown
				})
			}
		})
	})
})

module.exports = router