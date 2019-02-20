/**
 * http://usejsdoc.org/
 */
const Amount = require('./amount').Amount
const source = require('./source')
const destination = require('./destination')
const hpc = require('../utils/hastyPuddingCipherUtil')
const logger = require('../utils/logger')(__filename)
const RippleAPI = require('ripple-lib').RippleAPI
const api = new RippleAPI({
	server: 'wss://s.altnet.rippletest.net:51233'
})

// BEGIN TRANSACTION FLOW METHODS
//TODO these are nested calls and problems can occur if the api connection is severed too early. need to Un-nest

function signTransaction(txJSON, secret){
	api.connect().then(() => {
		logger.debug('signing transaction')
		return api.sign(txJSON, secret)
	}).then(signed => {
		logger.debug(signed)
		logger.debug('signing done')
		submitTransaction(signed.signedTransaction)
	}).then(() => {
		return api.disconnect()
	}).then(() => {
		logger.debug('done and disconnected')
	}).catch(error => {
		logger.error(error)
	})
}

function submitTransaction(signedTransaction){
	api.connect().then(() => {
		logger.debug('submitting transaction')
		return api.submit(signedTransaction)
	}).then(result => {
		logger.debug(result)
		logger.debug('submitted')
		verifyTransaction(result.id)
	}).then(() => {
		return api.disconnect()
	}).then(() => {
		logger.debug('done and disconnected')
	}).catch(error => {
		logger.error(error)
	})
}

function verifyTransaction(transactionID){
	api.connect().then(() => {
		logger.debug('verifying transaction')
		return api.getTransaction(transactionID)
	}).then(result => {
		logger.debug(result)
		logger.debug('verified')
	}).then(() => {
		return api.disconnect()
	}).then(() => {
		logger.debug('done and disconnected')
	}).catch(error => {
		logger.error(error)
	})
}
// END TRANSACTION FLOW METHODS
module.exports = {
		signTransaction,
		submitTransaction,
		verifyTransaction
}