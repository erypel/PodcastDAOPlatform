/**
 * documentation for this type of transaction:
 * https://developers.ripple.com/rippleapi-reference.html#escrow-creation
 */
const logger = require('../../utils/logger')(__filename)
const RippleAPI = require('ripple-lib').RippleAPI
const api = new RippleAPI({
	//server: 'wss://s1.ripple.com' //public production rippled server
	server: 'wss://s.altnet.rippletest.net:51233'
})

//TODO consolidate for all Rippled stuff
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
const daoAddress = 'rwYQjHp9HZiKKpZB4i4fvc8eQvAtA7vdY6'
const daoSecret = 'snKixQChzs9KcBxxrYWpm97sxnA1e'

/**
 * 
 * @param amount: value, Amount of XRP for sender to escrow.
 * @param destination: address,	Address to receive escrowed XRP.
 * @param allowCancelAfter: date-time string, Optional If present, the escrow may be cancelled after this time.
 * @param allowExecuteAfter: data-time string, Optional If present, the escrow can not be executed before this time.
 * @param condition: string, Optional A hex value representing a PREIMAGE-SHA-256 crypto-condition. If present, fulfillment is required upon execution.
 * @param destinationTag: integer, Optional Destination tag.
 * @param memos: memos, Optional Array of memos to attach to the transaction.
 * @param sourceTag: integer, Optional Source tag.
 * @returns
 */
function Specification(amount, destination, allowCancelAfter, allowExecuteAfter, condition, destinationTag, memos, sourceTag){
	this.amount = amount
	this.destination = destination
	this.allowCancelAfter = allowCancelAfter
	this.allowExecuteAfter = allowExecuteAfter
	this.condition = condition
	this.destinationTag = destinationTag
	this.memos = memos
	this.sourceTag = sourceTag
}
	
function prepareEscrowCreationTransaction(address, specification, instructions) {
	api.connect().then(() => {
		logger.info('getting prepareEscrowCreation')
		return api.prepareEscrowCreation(address, payment)
	}).then(prepared => {
		logger.info(prepared)
		logger.info('prepareEscrowCreation done')
		signTransaction(prepared.txJSON, daoSecret)
	}).then(() => {
		//return api.disconnect()
	}).then(() => {
		logger.info('done and disconnected')
	}).catch(console.error)
}

module.exports = {
		Specification,
		prepareEscrowCreationTransaction
}