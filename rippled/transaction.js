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
const daoAddress = 'rwYQjHp9HZiKKpZB4i4fvc8eQvAtA7vdY6'

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
				let amountAsDrops = amountAsDecimal.mul(100000) //convert XRP to drops
				let tipAmount = new Amount(amountAsDrops.toString())
				let s = source.buildSource(daoAddress, tipAmount, hpc.map(sourceUserID))
				let d = destination.buildDestination(daoAddress, tipAmount, hpc.map(destinationUserID))
				let payment = specification.buildSpecification(s, d)
				console.log(s)
				console.log(d)
				console.log(payment)
			}
		})
	})
	
	
}

// BEGIN TRANSACTION FLOW METHODS
function preparePaymentTransaction(){
	
}

function signTransaction(){
	
}

function submitTransaction(){
	
}

function verifyTransaction(){
	
}
// END TRANSACTION FLOW METHODS
module.exports = {
		tipUser
}