/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const podcastStore = require('../podcast/podcastStore')
const walletStore = require('../wallet/walletStore')
const transaction = require('./internalTransaction')
const Address = require('./address')
const payment = require('./payment/payment')
const Decimal = require('decimal.js')
const wallet = require('../wallet/wallet')
const session = require('../authentication/session')
const logger = require('../utils/logger')(__filename)

router.use(bodyParser.json())
router.use(bodyParser.urlencoded())

//TODO will eventually want to update the platform's balance
router.post('/sendXRP', session.requireLogin, (req, res) => {
	// Get the form values
	let amountToSend = req.body.amount
	let destinationAddress = req.body.address
	let destinationTag = req.body.dest_tag
	let userID = req.session.user.id
	let walletID = req.body.walletID
	
	// first check that there is nothing screwy going on by looking up the wallet attached to the session user. compare it to the wallet ID that came with the form
	walletStore.getWalletID(userID).then(result => {
		if(result === walletID){
			logger.error("Something critically wrong happened when sending XRP off platform. Session UserID=" + userID + " Form WalletID=" + walletID + " mapped UserID=" + result)
			res.status(400).send('Something is very wrong!\n<form action="/wallet" method = "get"><button>Return to Wallet</button></form>')
			return false
		}
		else{
			return true
		}
	}).then(walletCheck => {
		// validate the destination address
		if(walletCheck === true){
			return Address.validateAddress(destinationAddress)
		}
	}).then(destinationCheck => {
		// check that that there are sufficient funds available
		console.log('dest', destinationCheck)
		if(destinationCheck === true){
			/*walletStore.getWalletBalance(walletID).then(balance => {
				console.log('b', balance)
				let decimalBalance = new Decimal(balance)
				let amountBalance = new Decimal(amountToSend)
		
				return !decimalBalance.sub(amountBalance).isNegative()
			})*/
			return wallet.hasSufficientFunds(walletID, amountToSend)
		}
	})//TODO confirm with the user
	.then(fundsCheck => {
		// update user's balance
		console.log('fundsCheck', fundsCheck)
		if(fundsCheck){
			let amount = new Decimal(amountToSend)
			if(amount.isPositive()){
				//TODO get confirmation
				wallet.subtractFunds(walletID, amountToSend)
				return true
			}
		}
	}).then(goodToGo=>{
		// send
		if(goodToGo === true){
			payment.sendExternal(amountToSend, destinationAddress, destinationTag)
		}
	})
	
	
	
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