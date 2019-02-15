/**
 * This is the entry point to the application
 * Using nodemon to start app server
 */
const express = require('express')
const app = express()
const logger = require('./logger')(__filename)

logger.info('Logger is initialized.')

app.set('view engine', 'ejs');

//Static audio files
app.use('/uploads', express.static(__dirname + '/uploads'));

//Routes
app.use(require('./routes'))
app.use(require('./authentication/routes'))
app.use(require('./podcast/routes'))
app.use(require('./rss/routes'))
app.use(require('./wallet/routes'))
app.use(require('./rippled/routes'))
app.use(require('./advertising/routes'))
app.use(require('./advertising/adcampaign/routes'))

app.listen(3000, () => {
	logger.info('Server running on http://localhost:3000')
})