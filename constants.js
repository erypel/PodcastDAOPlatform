/**
 * http://usejsdoc.org/
 */
module.exports = Object.freeze({
	// VIEWS
	CAMPAIGN_VIEW: 'campaign',
	UPLOAD_AD_VIEW: 'uploadAd',
	ADVERTISEMENT_VIEW: 'advertisement',
	SELECT_PODCAST_VIEW: 'selectPodcast',
	
	// DATABASE TABLES
	AD_CAMPAIGN_TABLE: 'adcampaign',
	ADVERTISEMENT_TABLE: 'advertisement',
	AD_LINK_TABLE: 'adlink',
	USER_TABLE: 'user',
	
	// USER PROFILES
	CONTENT_CREATOR_USER_PROFILE: 'CONTENT_CREATOR',
	ADVERTISER_USER_PROFILE: 'ADVERTISER',
	
	// GENERIC MESSAGES
	SUCCESS_AND_RETURN_TO_DASHBOARD: 'Success!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>',
	
	// AD CAMPAIGN MESSAGES
	CREATE_AD_FIRST: 'You must create an ad first!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>',
	
	// AUTHENTICATION MESSAGES
	LOGIN_FAILED: 'Login failed. Invalid userID or password',
	USER_IS_LOCKED: 'User is locked.',
	
	// ADVERTISEMENT MESSAGES
	LINK_SUCCESS_MESSAGE: 'Linked!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>',
	UPLOAD_SUCCESS_MESSAGE: 'Uploaded!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>'
})