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
	WALLET_TABLE: 'wallet',
	
	// USER PROFILES
	CONTENT_CREATOR_USER_PROFILE: 'CONTENT_CREATOR',
	ADVERTISER_USER_PROFILE: 'ADVERTISER',
	
	//TEST USER CREDENTIALS
	USERNAME_FOR_TESTING: 'testusername',
	EMAIL_FOR_TESTING: 'test@test.com',
	PASSWORD_FOR_TESTING: 'ABCabc123!',
	PROFILE_FOR_TESTING: 'TEST',
	
	// GENERIC MESSAGES
	SUCCESS_AND_RETURN_TO_DASHBOARD: 'Success!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>',
	
	// AD CAMPAIGN MESSAGES
	CREATE_AD_FIRST: 'You must create an ad first!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>',
	
	// AUTHENTICATION MESSAGES
	LOGIN_FAILED: 'Login failed. Invalid userID or password',
	USER_IS_LOCKED: 'User is locked.',
	
	// ADVERTISEMENT MESSAGES
	LINK_SUCCESS_MESSAGE: 'Linked!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>',
	UPLOAD_SUCCESS_MESSAGE: 'Uploaded!\n<form action="/dashboard" method = "get"><button>Return to Dashboard</button></form>',
	
	
	// XRP CONSTANTS
	/**
	 * Your Credentials
	Address
	rBpMw6fUSV6TnxeAK1wEhuj854ZiTasjtS
	Secret
	sp1C74ibduMAXbBRN6LnXXgguNTDa
	Balance
	10,000 XRP
	 */

	/**
	 * public: rwYQjHp9HZiKKpZB4i4fvc8eQvAtA7vdY6
	 * secret: snKixQChzs9KcBxxrYWpm97sxnA1e
	 */
	DAO_ADDRESS: 'rwYQjHp9HZiKKpZB4i4fvc8eQvAtA7vdY6',
	DAO_SECRET: 'snKixQChzs9KcBxxrYWpm97sxnA1e',
	TEST_SERVER: 'wss://s.altnet.rippletest.net:51233',
	PRODUCTION_SERVER: 'wss://s1.ripple.com'//public production rippled server
})