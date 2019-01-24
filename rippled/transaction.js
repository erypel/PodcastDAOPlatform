/**
 * http://usejsdoc.org/
 */
const walletStore = require('../wallet/walletStore')
const Decimal = require('decimal.js')
const Amount = require('./amount').Amount
const source = require('./source')
const destination = require('./destination')
const specification = require('./specification')
const hpc = require('../utils/hastyPuddingCipherUtil')
const RippleAPI = require('ripple-lib').RippleAPI
const api = new RippleAPI({
	//server: 'wss://s1.ripple.com' //public production rippled server
	server: 'wss://s.altnet.rippletest.net:51233'
})
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

//TODO consider re-authentication when moving lots of $$$ https://www.owasp.org/index.php/Transaction_Authorization_Cheat_Sheet	
	
function tipUser(sourceUserID, destinationUserID, amount) {
	return new Promise(function(resolve, reject) {
		walletStore.getUserBalance(sourceUserID).then((balance) => {
			let amountAsDecimal = new Decimal(amount)
			let balanceAsDecimal = new Decimal(balance)
			
			// check that the tipper has enough funds to actually tip
			if(balanceAsDecimal.lessThan(amountAsDecimal)){
				reject('Insufficient funds to tip ' + amount + 'XRP')
			}
			else{
				//TODO need error handling here and to roll back first transaction should second fail
				//mayb there is a way to do transactions in batches
				let tipperNewBalance = balanceAsDecimal.sub(amountAsDecimal)
				walletStore.updateUserBalance(sourceUserID, tipperNewBalance.toString()).then((result) => {
					if(result){
						walletStore.getUserBalance(destinationUserID).then((balance) => {
							let tippeeBalance = new Decimal(balance)
							let tippeeNewBalance = tippeeBalance.add(amountAsDecimal)
							console.log("tippeeNewBalance", tippeeNewBalance.toString())
							walletStore.updateUserBalance(destinationUserID, tippeeNewBalance.toString()).then((result) => {
								if(result){
									resolve('Tipped ' + amount + 'XRP')
								}
								else{
									//TODO need to roll everything back
								}
							})
							
						})
					}
					else{
						console.log('error: ' + result)
					}
				})
				/*
				let amountAsDrops = amountAsDecimal.mul(100000) //convert XRP to drops
				let tipAmount = new Amount(amountAsDrops.toString())
				let s = source.buildSource(daoAddress, tipAmount, Number(hpc.map(sourceUserID).toString(10).substring(0, 10)))
				let d = destination.buildDestination(daoAddress, tipAmount, Number(hpc.map(destinationUserID).toString(10).substring(0, 10)))
				let payment = specification.buildSpecification(s, d)*/
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
				//preparePaymentTransaction(daoAddress, payment)
			}
		})
	})
	
	
}

// BEGIN TRANSACTION FLOW METHODS
//TODO these are nested calls and problems can occur if the api connection is severed too early. need to Un-nest
function preparePaymentTransaction(address, payment){
	api.connect().then(() => {
		
		console.log('getting preparePayment')
		return api.preparePayment(address, payment)
	}).then(prepared => {
		console.log(prepared)
		console.log('preparePayment done')
		signTransaction(prepared.txJSON, daoSecret)
	}).then(() => {
		//return api.disconnect()
	}).then(() => {
		console.log('done and disconnected')
	}).catch(console.error)
}

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
		tipUser
}