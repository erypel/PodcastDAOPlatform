/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const fileupload = require("express-fileupload"); //TODO too slow for large files, update later
const session = require('../authentication/session')
const adStore = require('./adStore')
const fs = require('fs')

router.use(bodyParser.json())

router.get('/uploadAd', session.requireLogin, (req, res) => {
	res.render('uploadAd')
})

router.get('/advertisement', session.requireLogin, (req, res) => {
	adStore.getAllAds(function(ads){
		res.render('advertisement', {
			ads: ads
		})
	})
})

router.post('/uploadAdFile', (req, res) => {
	adStore.saveAdToDB(req, res, {
		ad_name: req.body.adName, 
		description: req.body.adDescription, 
		owner_id: req.session.user.id
	}).then(({success, id, path}) => {
		if(success) {
			res.send('Uploaded!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>')
		}
		else res.sendStatus(400)
	})
})

module.exports = router