/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const walletStore = require('./walletStore')
const walletMapper = require('../utils/hastyPuddingCipherUtil')
const session = require('../authentication/session')
const BigNumber = require('bn.js')

router.use(bodyParser.json())

function getWalletID(ownerID) {
	return  walletStore.getWalletID(ownerID)
}

function getFunds(ownerID) {
	return  walletStore.getUserBalance(ownerID)
}

function renderWallet(userID, res, destinationTag = null){
	let walletID = Promise.resolve(getWalletID(userID))
	walletID.then(function(value){
		walletID = value
	})
	let funds = Promise.resolve(getFunds(userID))
	funds.then(function(value){
		funds = value
		console.log("userID: " + userID + " walletID: " + walletID + " funds: " + funds)
		res.render('wallet', {userID, walletID, funds, destinationTag})
	})
}

router.get('/mapDestinationTag', session.requireLogin, (req, res) => {
	// use userID to map to destination tag
	let userID = req.session.user.id
	let destinationTag = Promise.resolve(walletMapper.map(userID))
	destinationTag.then(function(value){
		destinationTag = value
		renderWallet(userID, res, destinationTag)
	})
})

router.get('/wallet', session.requireLogin, (req, res) => {
	let destinationTag = ''
	let userID = req.session.user.id
	
	renderWallet(userID, res)
})

module.exports = router