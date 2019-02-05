/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('../../knexfile'))

function insertAdCampaign(campaign, userID){
	return knex('adcampaign').insert({
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

function selectAllAdCampaigns(){
	return knex('adcampaign')
}

function getAdCampaignForAd(adID){
	return knex('adcampaign').where({ad_id: adID})
}

function deleteCampaign(campaignID){
	console.log('Removing campaign with ID ' + campaingID)
	return knex('adcampaign').where({id: campaignID}).del()
}

function updateCurrAmount(id, newBalance){
	console.log("id:", id)
	console.log("new balance:", newBalance)
	return knex('adcampaign').where({id: id}).update({curr_amount: newBalance})
}

module.exports = {
		insertAdCampaign,
		getAdCampaignForAd,
		selectAllAdCampaigns,
		deleteCampaign,
		updateCurrAmount
	}