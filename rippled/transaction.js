/**
 * http://usejsdoc.org/
 */
const Amount = require('./amount').Amount
const source = require('./source')
const destination = require('./destination')
const hpc = require('../utils/hastyPuddingCipherUtil')
const RippleAPI = require('ripple-lib').RippleAPI
const api = new RippleAPI({
	server: 'wss://s.altnet.rippletest.net:51233'
})

// BEGIN TRANSACTION FLOW METHODS
//TODO these are nested calls and problems can occur if the api connection is severed too early. need to Un-nest

function signTransaction(txJSON, secret){
	api.connect().then(() => {
		console.log('signing transaction')
		return api.sign(txJSON, secret)
	}).then(signed => {
		console.log(signed)
		console.log('signing done')
		submitTransaction(signed.signedTransaction)
	}).then(() => {
		//return api.disconnect()
	}).then(() => {
		console.log('done and disconnected')
	}).catch(console.error)
}

function submitTransaction(signedTransaction){
	api.connect().then(() => {
		console.log('submitting transaction')
		return api.submit(signedTransaction)
	}).then(result => {
		console.log(result)
		console.log('submitted')
		verifyTransaction(result.id)
	}).then(() => {
		return api.disconnect()
	}).then(() => {
		console.log('done and disconnected')
	}).catch(console.error)
}

function verifyTransaction(transactionID){
	api.connect().then(() => {
		console.log('verifying transaction')
		return api.getTransaction(transactionID)
	}).then(result => {
		console.log(result)
		console.log('verified')
	}).then(() => {
		return api.disconnect()
	}).then(() => {
		console.log('done and disconnected')
	}).catch(console.error)
}
// END TRANSACTION FLOW METHODS
module.exports = {
		signTransaction,
		submitTransaction,
		verifyTransaction
}