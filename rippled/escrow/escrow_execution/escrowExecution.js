/**
 * documentation for this type of transaction:
 * https://developers.ripple.com/rippleapi-reference.html#escrow-execution
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
		logger.info('getting prepareEscrowExecution')
		return api.prepareEscrowCreation(address, payment)
	}).then(prepared => {
		logger.info(prepared)
		logger.info('prepareEscrowExecution done')
		signTransaction(prepared.txJSON, daoSecret)
	}).then(() => {
		//return api.disconnect()
	}).then(() => {
		logger.info('done and disconnected')
	}).catch(console.error)
}

module.exports = {
		Specification,
		prepareEscrowExecutionTransaction
}