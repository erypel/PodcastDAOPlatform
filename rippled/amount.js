/**
 * ONLY FOR XRP USE
 */
function Amount(value){
	this.currency = "drops"
	this.value = value
}

function buildAmount(amount){
	return {currency: amount.currency, value: amount.value}
}

module.exports = {Amount, buildAmount}