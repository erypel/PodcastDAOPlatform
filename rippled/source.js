/**
 * The source of the funds to be sent.
 */
function Source(address, amount, tag, maxAmount){
	this.address = address
	this.amount = amount
	this.tag = tag
	this.maxAmount = maxAmount
}

function buildSource(address, amount, tag){
	return new Source(address, amount, tag, amount)
}

module.exports = {Source, buildSource}