/**
 * http://usejsdoc.org/
 */
const express = require('express')
const session = require('../authentication/session')
const bodyParser = require('body-parser')
const router = express.Router()

router.get('/voting', session.requireLogin, (req, res) => {
	res.render('voting')
})

module.exports = router