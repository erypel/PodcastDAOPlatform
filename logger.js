const { createLogger, format, transports } = require('winston')
const path = require('path')

//This will log to console. Eventually will want a log file
const logger = caller => {
	return createLogger({
		// levels are:
		// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
		level: 'debug',
		format: format.combine(
				format.label({ label: path.basename(caller) }),
				format.colorize(),
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss'
				}),
				format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
		),
		transports: [new transports.Console()]
	})
}

module.exports = logger;