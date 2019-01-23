'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

/**
 * Test Credentials:
 * 
 * Public Address:
 * rwYQjHp9HZiKKpZB4i4fvc8eQvAtA7vdY6
 * 
 * Private Key:
 * snKixQChzs9KcBxxrYWpm97sxnA1e
 */
const api = new RippleAPI({
	//server: 'wss://s1.ripple.com' //public production rippled server
	server: 'wss://s.altnet.rippletest.net:51233'
})

api.connect().then(() => {
	const myAddress = 'rwYQjHp9HZiKKpZB4i4fvc8eQvAtA7vdY6'
		
	console.log('getting account info for', myAddress)
	return api.getAccountInfo(myAddress)
}).then(info => {
	console.log(info)
	console.log('getAccountInfo done')
}).then(() => {
	return api.disconnect()
}).then(() => {
	console.log('done and disconnected')
}).catch(console.error)
