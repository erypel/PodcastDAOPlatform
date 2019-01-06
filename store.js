/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('./knexfile'))

module.exports = {
		createUser ({username, email, password}) {
			 console.log(`Add user ${username} with password ${password}`)
			 return knex('user').insert({
				 username,
				 email,
				 password
			 })
		}
}