/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const walletStore = require('./walletStore')
const walletMapper = require('../utils/hastyPuddingCipherUtil')

router.use(bodyParser.json())

//BEGIN DUPLICATE METHODS THAT SHOULD BE CONSOLODATED WITH WHATS IN ROUTES.JS

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  next();
});

//Session middleware
router.use(function(req, res, next) {
	//check that a session exists
	if(req.session && req.session.user){
		//TODO look for user in DB
		/*
		 * if(store.getUser(req.session.user.username)
		 * 		req.user = user;
		 * 		delete req.user.password //delete password from the session
		 * 		req.session.user = user //refresh session value
		 * 
		 * 		
		 */
		//finish processing the middleware and run the route
		req.user = req.session.user
		delete req.user.password
		delete req.user.encrypted_password
		next()
	} else {
		next()
	}
})

/**
 * check if a user is logged in and redirect them if they're not
 * @param req
 * @param res
 * @param next
 * @returns
 */
function requireLogin (req, res, next) {
	console.log("login required")
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

//END DUPLICATES

function getWalletID(ownerID) {
	return  walletStore.getWalletID(ownerID)
}

function getFunds(ownerID) {
	return  walletStore.getUserBalance(ownerID)
}

router.get('/mapDestinationTag', requireLogin, (req, res) => {
	// use userID to map to destination tag
	let userID = req.session.user.id
	let destinationTag = Promise.resolve(walletMapper.map(userID))
	destinationTag.then(function(value){
		destinationTag = value
	})
	
	// duplicate code of get /wallet
	//TODO consolidate 
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
})

router.get('/wallet', requireLogin, (req, res) => {
	let userID = req.session.user.id
	let walletID = Promise.resolve(getWalletID(userID))
	walletID.then(function(value){
		walletID = value
	})
	let funds = Promise.resolve(getFunds(userID))
	funds.then(function(value){
		funds = value
		console.log("userID: " + userID + " walletID: " + walletID + " funds: " + funds)
		res.render('wallet', {userID, walletID, funds})
	})
})

module.exports = router