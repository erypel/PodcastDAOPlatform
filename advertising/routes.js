/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const fileupload = require("express-fileupload"); //TODO too slow for large files, update later
const session = require('../authentication/session')
const fs = require('fs')

router.use(bodyParser.json())

router.get('/uploadAd', session.requireLogin, (req, res) => {
	res.render('uploadAd')
})

module.exports = router