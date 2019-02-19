/**
 * documentation for this type of transaction:
 * https://developers.ripple.com/rippleapi-reference.html#escrow-cancellation
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
		logger.info('getting prepareEscrowCancellation')
		return api.prepareEscrowCancellation(address, specification)
	}).then(prepared => {
		logger.info(prepared)
		logger.info('prepareEscrowCancellation done')
		signTransaction(prepared.txJSON, daoSecret)
	}).then(() => {
		//return api.disconnect()
	}).then(() => {
		logger.info('done and disconnected')
	}).catch(console.error)
}

module.exports = {
	Specification,
	prepareEscrowCancellationTransaction
}	