/**
 * http://usejsdoc.org/
 */
const Decimal = require('decimal.js')
const walletStore = require('./walletStore')
const logger = require('../utils/logger')(__filename)

function hasSufficientFunds(walletID, amount){
	return walletStore.getWalletBalance(walletID).then(balance => {
		// TODO figure out best way to represent these values
		console.log('b', balance)
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
		
		walletStore.updateWalletBalance(walletID, updatedBalance.toString()).then(()=>{
			logger.info("Creditted wallet:" + walletID + " " + amount + "XRP")

		})
	})
}

function subtractFunds(walletID, amount){
	walletStore.getWalletBalance(walletID).then(balance => {
		// TODO figure out best way to represent these values
		let decimalBalance = new Decimal(balance)
		let amountBalance = new Decimal(amount)
		
		let updatedBalance = decimalBalance.sub(amountBalance)
		
		walletStore.updateWalletBalance(walletID, updatedBalance.toString()).then(()=>{
			logger.info("Debitted wallet:" + walletID + " " + amount + "XRP")
		})
	})
}

module.exports = {
	hasSufficientFunds,
	addFunds,
	subtractFunds
}