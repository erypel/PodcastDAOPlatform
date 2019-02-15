/**
 * The Data Access Object for Ad Campaigns.
 * 
 * This file contains all the CRUD operations for the db table ADCAMPAIGN
 */
const knex = require('knex')(require('../../knexfile'))
const constants = require('../../constants')
const logger = require('../../logger')(__filename)

function insertAdCampaign(campaign, userID){
	return knex(constants.AD_CAMPAIGN_TABLE).insert({
		title: campaign.title,
		description: campaign.description,
		init_amount: campaign.budget,
		curr_amount: campaign.budget,
		pay_per_view: campaign.price,
		allow_cancel_after: campaign.cancel_date,
		allow_execute_after: campaign.start_date,
		ad_id: campaign.ads,
		user_id: userID
	}, 'id').then((result) => {
        return { success: true, id: result[0] }
      })

}

function updateCurrAmount(id, newBalance){
	return knex(constants.AD_CAMPAIGN_TABLE).where({id: id}).update({curr_amount: newBalance})
}

function selectAllAdCampaigns(){
	return knex(constants.AD_CAMPAIGN_TABLE)
}

function getAdCampaignForAd(adID){
	return knex(constants.AD_CAMPAIGN_TABLE).where({ad_id: adID})
}

function deleteCampaign(campaignID){
	logger.info("Deleting campaign with id:%d", campaignID)
	return knex(constants.AD_CAMPAIGN_TABLE).where({id: campaignID}).del()
}

module.exports = {
		insertAdCampaign,
		getAdCampaignForAd,
		selectAllAdCampaigns,
		deleteCampaign,
		updateCurrAmount
	}