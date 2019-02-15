/**
 * The Data Access Object for the adlink db table
 */
const knex = require('knex')(require('../../knexfile'))
const constants = require('../../constants')

function linkAdToPodcast(adID, podcastID){
	return knex(constants.AD_LINK_TABLE).insert({
		ad_ID: adID,
		podcast_ID: podcastID
	}, 'id').then((result) => {
        return { success: true, id: result[0] }
    })
}

function getLinkedAdID(podcastID){
	return knex(constants.AD_LINK_TABLE).select('ad_ID').where({podcast_ID: podcastID})
}

function removeLink(podcastID, adID){
	return knex(constants.AD_LINK_TABLE).where({ad_id: adID, podcast_id: podcastID}).del()
}

module.exports = {
		linkAdToPodcast,
		getLinkedAdID,
		removeLink
}