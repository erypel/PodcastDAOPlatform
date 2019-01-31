/**
 * http://usejsdoc.org/
 */
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const session = require('../../authentication/session')
const adStore = require('../adStore')

router.get('/campaign', session.requireLogin, (req, res) => {
	res.render('campaign')
})

module.exports = router