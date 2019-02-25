/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const walletStore = require('./walletStore')
const walletMapper = require('../utils/hastyPuddingCipherUtil')
const session = require('../authentication/session')
const constants = require('../constants')
const BigNumber = require('bn.js')

router.use(bodyParser.json())

function getWalletID(ownerID) {
	return  walletStore.getWalletID(ownerID)
}

function getFunds(ownerID) {
	return  walletStore.getUserBalance(ownerID)
}

function renderWallet(userID, profile, res, destinationTag = null){
	let header = getHTMLHeader(profile)
	let walletID = Promise.resolve(getWalletID(userID))
	walletID.then(function(value){
		walletID = value
	})
	let funds = Promise.resolve(getFunds(userID))
	funds.then(function(value){
		funds = value
		console.log("userID: " + userID + " walletID: " + walletID + " funds: " + funds)
		res.render('wallet', {userID, walletID, funds, destinationTag, header})
	})
}

function getHTMLHeader(profile){
	if(profile === constants.CONTENT_CREATOR_USER_PROFILE) {
		return '../partials/navbar'
	}
	else if(profile === constants.ADVERTISER_USER_PROFILE) {
		return '../partials/advertiserNavbar'
	}
}

function getProfileType(req){
	let profile = ''
	if(req.session.user.profile === constants.CONTENT_CREATOR_USER_PROFILE) {
		profile = constants.CONTENT_CREATOR_USER_PROFILE
	}
	else if(req.session.user.profile === constants.ADVERTISER_USER_PROFILE) {
		profile = constants.ADVERTISER_USER_PROFILE
	}
	return profile
}

router.get('/mapDestinationTag', session.requireLogin, (req, res) => {
	let profile = getProfileType(req)
	// use userID to map to destination tag
	let userID = req.session.user.id
	let destinationTag = Promise.resolve(walletMapper.map(userID))
	destinationTag.then(function(value){
		destinationTag = value
		renderWallet(userID, profile, res, destinationTag)
	})
})

router.get('/wallet', session.requireLogin, (req, res) => {
	let profile = getProfileType(req)
	let destinationTag = ''
	let userID = req.session.user.id
	
	renderWallet(userID, profile, res)
})

module.exports = router