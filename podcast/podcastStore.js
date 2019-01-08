/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('../knexfile'))

module.exports = {
	savePodcastToDB({episode_name, description, episode, owner_id}) {
		let path = constructPathToPodcastOnFileStore(episode_name)
		return knex('podcast').insert({
			episode_name,
			description,
			path,
			owner_id
		}).then(() => {
	        return { success: true }
	      })
	}
}

//TODO this can be better
function constructPathToPodcastOnFileStore(episodeName){
	return "C:/Users/Evan/workspace/PodcastDAOPlatform/uploads/" + episodeName
}