/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const podcastStore = require('../podcast/podcastStore')
const transaction = require('./internalTransaction')
const session = require('../authentication/session')
const logger = require('../utils/logger')(__filename)

router.use(bodyParser.json())
router.use(bodyParser.urlencoded())

router.post('/sendXRP', session.requireLogin, (req, res) => {
	// Get the form values
	let amountToSend = req.body.amount
	let destinationAddress = req.body.address
	let destinationTag = req.body.dest_tag
	let userID = req.session.userID
	let walletID = req.body.walletID
	
	// first check that there is nothing screwy going on by looking up the wallet attached to the session user. compare it to the wallet ID that came with the form
	
	// validate the destination address
	
	// check that that there are sufficient funds available
	
	// confirm with user
	
	// send
})

router.post('/tip', session.requireLogin, (req, res) => {
	let tipperUserID = req.session.user.id
	let podcastID = req.body.podcastID
	podcastStore.getUploaderID(podcastID).then((result) => {
		console.log(result)
		let uploaderID = result[0].owner_id
		if(uploaderID == tipperUserID){
			res.status(400).send('You can\'t tip yourself, silly goose!\n<form action="/podcast" method = "get"><button>Return to Podcasts</button></form>')
			return {success: false}
		}
		return {success: true, uploaderID: uploaderID}
	}).then((result) => {
		if(result.success) {
			transaction.tipUser(tipperUserID, result.uploaderID, '1.00000000').then((function(response){
				res.status(200).send(response + '\n<form action="/podcast" method = "get"><button>Return to Podcasts</button></form>')
			}), function(error) {
				res.status(400).send(error + '\n<form action="/podcast" method = "get"><button>Return to Podcasts</button></form>')
			})
		}
	})
})

module.exports = router