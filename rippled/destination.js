/**
 * http://usejsdoc.org/
 */
function Destination(address, amount, tag, minAmount){
	this.address = address
	this.amount = amount
	this.tag = tag
	this.minAmount = minAmount
}

module.exports = {Destination}