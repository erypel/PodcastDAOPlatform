/**
 * This is the entry point to the application
 * Using nodemon to start app server
 */
const express = require('express')
const bodyParser = require('body-parser')
const store = require('./authentication/store')
const app = express()
app.set('view engine', 'ejs');

app.use(express.static('authentication'))
app.use(bodyParser.json())

app.get('/', function(req, res) {
	res.render("login")
})

app.get('/login', function(req, res) {
	res.render("login")
})

app.get('/createUser', function(req, res) {
	res.render("createUser")
})

app.get('/dashboard', function(req, res) {
	res.render("dashboard")
})

app.post('/createUser', (req, res) => {
	store.createUser({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	}).then(() => res.sendStatus(200))
})

app.post('/login', (req, res) => {
	store.authenticate({
		username: req.body.username,
		password: req.body.password
	}).then(({success}) => {
		if(success) res.sendStatus(200)
		else res.sendStatus(401)
	})
})

app.listen(3000, () => {
	console.log('Server running on http://localhost:3000')
})