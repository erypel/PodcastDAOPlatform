/**
 * documentation for this type of transaction:
 * https://developers.ripple.com/rippleapi-reference.html#escrow-creation
 */
const logger = require('../../utils/logger')(__filename)
const constants = require('../../constants')
const RippleAPI = require('ripple-lib').RippleAPI
const api = new RippleAPI({
	server: constants.TEST_SERVER
})

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
		logger.debug('getting prepareEscrowCreation')
		return api.prepareEscrowCreation(address, specification)
	}).then(prepared => {
		logger.debug(prepared)
		logger.debug('prepareEscrowCreation done')
		signTransaction(prepared.txJSON, constants.DAO_SECRET)
	}).then(() => {
		return api.disconnect()
	}).then(() => {
		logger.debug('done and disconnected')
	}).catch.catch(error => {
		logger.error(error)
	})
}

module.exports = {
		Specification,
		prepareEscrowCreationTransaction
}