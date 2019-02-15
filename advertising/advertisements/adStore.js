/**
 * The Data Access Object for the ADVERTISEMENTS table
 */
const knex = require('knex')(require('../../knexfile'))
const utils = require('../../utils/utils')
const constants = require('../../constants')

function saveAdToDB(req, res, {ad_name, description, owner_id}) {
	let path = utils.uploadAd(req, res)
	return knex(constants.ADVERTISEMENT_TABLE).insert({
		ad_name,
		description,
		path,
		owner_id
	}, 'id').then((result) => {
        return { success: true, id: result[0], path: path }
      })
}

function selectAdByID(adID){
	return knex(constants.ADVERTISEMENT_TABLE).select().where({id: adID})
}

//TODO this should eventually become something based off of an organization ID
function selectAdsByUserID(userID){
	return knex(constants.ADVERTISEMENT_TABLE).select().where({owner_id: userID})
}

function selectAdsWhereInByID(arrayOfAdIDs){
	return knex(constants.ADVERTISEMENT_TABLE).select().whereIn('id', arrayOfAdIDs)
}

module.exports = {
	saveAdToDB,
	selectAdByID,
	selectAdsByUserID,
	selectAdsWhereInByID
}