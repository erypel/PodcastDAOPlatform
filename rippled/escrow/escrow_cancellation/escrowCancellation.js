/**
 * documentation for this type of transaction:
 * https://developers.ripple.com/rippleapi-reference.html#escrow-cancellation
 */
const logger = require('../../utils/logger')(__filename)
const constants = require('../../constants')
const RippleAPI = require('ripple-lib').RippleAPI
const api = new RippleAPI({
	server: constants.TEST_SERVER
})

/**
 * 
 * @param owner: address, The address of the owner of the escrow to cancel.
 * @param escrowSequence: sequence, The account sequence number of the Escrow Creation transaction for the escrow to cancel.
 * @param memos: memos[], Optional Array of memos to attach to the transaction.
 * @returns
 */
function Specification(owner, escrowSequence, memos){
	this.owner = owner
	this.escrowSequence = escrowSequence
	this.memos = memos
}	

function prepareEscrowCancellationTransaction(address, specification, instructions){
	api.connect().then(() => {
		logger.debug('getting prepareEscrowCancellation')
		return api.prepareEscrowCancellation(address, specification)
	}).then(prepared => {
		logger.debug(prepared)
		logger.debug('prepareEscrowCancellation done')
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
	prepareEscrowCancellationTransaction
}	