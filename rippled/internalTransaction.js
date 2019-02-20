const walletStore = require('../wallet/walletStore')
const Decimal = require('decimal.js')
const logger = require('../utils/logger')(__filename)

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
				//maybe there is a way to do transactions in batches
				let tipperNewBalance = balanceAsDecimal.sub(amountAsDecimal)
				walletStore.updateUserBalance(sourceUserID, tipperNewBalance.toString()).then((result) => {
					if(result){
						walletStore.getUserBalance(destinationUserID).then((balance) => {
							let tippeeBalance = new Decimal(balance)
							let tippeeNewBalance = tippeeBalance.add(amountAsDecimal)
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
						logger.error(result)
					}
				})
			}
		})
	})
}

module.exports = {
		tipUser
}