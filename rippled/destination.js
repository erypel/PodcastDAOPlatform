/**
 * 	The destination of the funds to be sent.
 */
function Destination(address, amount, tag, minAmount){
	this.address = address
	this.amount = amount
	this.tag = tag
	this.minAmount = minAmount
}

function buildDestination(address, amount, tag){
	return new Destination(address, amount, tag, amount)
}

module.exports = {Destination, buildDestination}