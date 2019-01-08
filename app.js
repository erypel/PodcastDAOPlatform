/**
 * This is the entry point to the application
 * Using nodemon to start app server
 */
const express = require('express')
const app = express()
app.set('view engine', 'ejs');

//Routes
app.use(require('./routes'))
app.use(require('./authentication/routes'))
app.use(require('./podcast/routes'))

app.listen(3000, () => {
	console.log('Server running on http://localhost:3000')
})