/**
 * http://usejsdoc.org/
 */
module.exports = Object.freeze({
	// ROUTES
	AD_CAMPAIGN_ROUTE: '/campaign',
	CREATE_AD_CAMPAIGN_ROUTE: '/createCampaign',
	PAY_AUTHOR_ROUTE: '/payAuthor',
	
	// VIEWS
	CAMPAIGN_VIEW: 'campaign',
	
	// USER PROFILES
	CONTENT_CREATOR_USER_PROFILE: 'CONTENT_CREATOR',
	ADVERTISER_USER_PROFILE: 'ADVERTISER',
	
	// GENERIC MESSAGES
	SUCCESS_AND_RETURN_TO_DASHBOARD: 'Success!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>',
	
	// AD CAMPAIGN MESSAGES
	CREATE_AD_FIRST: 'You must create an ad first!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>'
})