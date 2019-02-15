/**
 * This is the entry point to the application
 * Using nodemon to start app server
 */
const express = require('express')
const app = express()
const { createLogger, format, transports } = require('winston')

// This will log to console. Eventually will want a log file
const logger = createLogger({
	// levels are:
	// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
	level: 'debug',
	format: format.combine(
		    format.colorize(),
		    format.timestamp({
		      format: 'YYYY-MM-DD HH:mm:ss'
		    }),
		    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
		  ),
	transports: [new transports.Console()]
})

logger.info('Logging is up and running!')

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
	console.log('Server running on http://localhost:3000')
})