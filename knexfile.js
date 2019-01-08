/**
 * This is the connection manager. Documentation can be found here: https://knexjs.org/
 */
module.exports = {
		client: 'mysql',
		connection: {
			host: "localhost",
			user: 'root',
			password: 'password',
			database: 'podcastdaoplatformdb'
		}
}