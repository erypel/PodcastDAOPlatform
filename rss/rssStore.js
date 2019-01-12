/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('../knexfile'))

module.exports = {
	saveToDB(req, res, {title, description, language, copyright, explicit, path, owner_id}){
		return knex('rssfeed').insert({
			title,
			path,
			language,
			description,
			explicit,
			copyright,
			owner_id
		}).then(() => {
	        return { success: true }
	      })
	}
}