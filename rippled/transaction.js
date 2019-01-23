/**
 * http://usejsdoc.org/
 */
const walletStore = require('../wallet/walletStore')
const Decimal = require('decimal.js')
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