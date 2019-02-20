/**
 * This is the specification for Payment transactions. It specifies what a 
 * transaction should do
 */
const Source = require('./source')
const Dest = require('./destination')
const constants = require('../../constants')
const RippleAPI = require('ripple-lib').RippleAPI
const api = new RippleAPI({
	server: constants.TEST_SERVER
})

function Specification(source, destination, allowPartialPayment = false, invoiceID = "", limitQuality = false, memos = [], noDirectRipple = false, paths = "") {
	this.source = source
	this.destination = destination
	this.allowPartialPayment = allowPartialPayment
	this.invoiceID = invoiceID
	this.limitQuality = limitQuality
	this.memos = memos
	this.noDirectRipple = noDirectRipple
	this.paths = paths
}

/*
 * We want payment objects to look like this:
 * 
 * payment = { 
	"source": { 
		"address": "rwYQjHp9HZiKKpZB4i4fvc8eQvAtA7vdY6", 
		"tag": 1176135248, 
		"maxAmount": { 
			"currency": "drops", 
			"value": "1000000" 
		} 
	}, 
	"destination": { 
		"address": "rwYQjHp9HZiKKpZB4i4fvc8eQvAtA7vdY6", 
		"amount": { 
			"currency": "drops", 
			"value": "1000000" 
		}, 
		"tag": 1530675606
	} 
}

payment = {
		  "source": {
			    "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
			    "maxAmount": {
			      "value": "0.01",
			      "currency": "USD",
			      "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
			    }
			  },
			  "destination": {
			    "address": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
			    "amount": {
			      "value": "0.01",
			      "currency": "USD",
			      "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
			    }
			  }
			}
*/
function buildSpecification(source, destination){
	let spec = new Specification(source, destination)
	return {source: source, destination: destination}
}

function preparePaymentTransaction(address, payment){
	api.connect().then(() => {
		
		console.log('getting preparePayment')
		return api.preparePayment(address, payment)
	}).then(prepared => {
		console.log(prepared)
		console.log('preparePayment done')
		signTransaction(prepared.txJSON, constants.DAO_SECRET)
	}).then(() => {
		//return api.disconnect()
	}).then(() => {
		console.log('done and disconnected')
	}).catch(console.error)
}

module.exports = { 
		Specification, 
		buildSpecification, 
		preparePaymentTransaction 
	}