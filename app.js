/**
 * This is the entry point to the application
 * Using nodemon to start app server
 */
const express = require('express')
const app = express()
const logger = require('./utils/logger')(__filename)

logger.info('Logger is initialized.')

app.set('view engine', 'ejs');
app.set('views', [__dirname + '/public/views/pages', __dirname + '/public/views/partials'])

//Static audio files
app.use('/uploads', express.static(__dirname + '/uploads'));

//frontend stuff goes here
app.use(express.static(__dirname + '/public'));

//Routes
app.use(require('./routes'))
app.use(require('./authentication/routes'))
app.use(require('./podcast/routes'))
app.use(require('./rss/routes'))
app.use(require('./wallet/routes'))
app.use(require('./rippled/routes'))
app.use(require('./advertising/advertisements/routes'))
app.use(require('./advertising/adcampaign/routes'))
app.use(require('./comment/routes'))
app.use(require('./voting/routes'))

app.listen(3000, () => {
	logger.info('Server running on http://localhost:3000')
})