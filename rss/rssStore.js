/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('../knexfile'))

module.exports = {
	saveRssFeedToDB(req, res, {title, description, language, copyright, explicit, path, owner_id}){
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
	},
	saveRssMessageToDB(req, res, {episodeName, description, path, owner_id, rssfeed_id, podcast_id}){
		console.log({episodeName, description, path, owner_id, rssfeed_id, podcast_id})
		return knex('rssmessage').insert({
			episodeName,
			description, 
			path, 
			owner_id, 
			rssfeed_id, 
			podcast_id
		}).then(() => {
	        return { success: true }
	      })
	},
	getFeedID(ownerID) {
		let rssFeedID
		return knex.select('id').table('rssfeed').where('owner_id', ownerID).then(function(rowDataPacket){
				return rowDataPacket[0].id
			})
	}
}