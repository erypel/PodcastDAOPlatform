/**
 * documentation for this type of transaction:
 * https://developers.ripple.com/rippleapi-reference.html#escrow-execution
 */
const logger = require('../../utils/logger')(__filename)
const constants = require('../../constants')
const RippleAPI = require('ripple-lib').RippleAPI
const api = new RippleAPI({
	server: constants.TEST_SERVER
})

/**
 * 
 * @param owner: address, 	The address of the owner of the escrow to execute.
 * @param escrowSequence: sequence, The account sequence number of the Escrow Creation transaction for the escrow to execute.
 * @param condition: string, Optional A hex value representing a PREIMAGE-SHA-256 crypto-condition. This must match the original condition from the escrow creation transaction.
 * @param fulfillment: string, Optional A hex value representing the PREIMAGE-SHA-256 crypto-condition fulfillment for condition
 * @param memos: memos[], Optional Array of memos to attach to the transaction
 * @returns
 */
function Specification(owner, escrowSequence, condition, fulfillment, memos){
	this.owner = owner
	this.escrowSequence = escrowSequence
	this.condition = condition
	this.fulfillment = fulfillment
	this.memos = memos
}
	
function prepareEscrowExecutionTransaction(address, specification, instructions) {
	api.connect().then(() => {
		logger.debug('getting prepareEscrowExecution')
		return api.prepareEscrowCreation(address, payment)
	}).then(prepared => {
		logger.debug(prepared)
		logger.debug('prepareEscrowExecution done')
		signTransaction(prepared.txJSON, constants.DAO_SECRET)
	}).then(() => {
		return api.disconnect()
	}).then(() => {
		logger.debug('done and disconnected')
	}).catch(error => {
		logger.error(error)
	})
}

module.exports = {
		Specification,
		prepareEscrowExecutionTransaction
}