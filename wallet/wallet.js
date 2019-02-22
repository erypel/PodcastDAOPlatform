/**
 * http://usejsdoc.org/
 */
const Decimal = require('decimal.js')
const walletStore = require('./walletStore')

function hasSufficientFunds(walletID, amount){
	walletStore.getWalletBalance(walletID).then(balance => {
		// TODO figure out best way to represent these values
		let decimalBalance = new Decimal(balance)
		let amountBalance = new Decimal(amount)
		
		return !decimalBalance.sub(amountBalance).isNegative()
	})
}

function addFunds(walletID, amount){
	walletStore.getWalletBalance(walletID).then(balance => {
		// TODO figure out best way to represent these values
		let decimalBalance = new Decimal(balance)
		let amountBalance = new Decimal(amount)
		
		let updatedBalance = decimalBalance.add(amountBalance)
		
		walletStore.updateWalletBalance(walletID, updatedBalance.toString())
	})
}

function subtractFunds(walletID, amount){
	walletStore.getWalletBalance(walletID).then(balance => {
		// TODO figure out best way to represent these values
		let decimalBalance = new Decimal(balance)
		let amountBalance = new Decimal(amount)
		
		let updatedBalance = decimalBalance.sub(amountBalance)
		
		walletStore.updateWalletBalance(walletID, updatedBalance.toString())
	})
}

module.exports = {
	hasSufficientFunds,
	addFunds,
	subtractFunds
}