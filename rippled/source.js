/**
 * The source of the funds to be sent.
 */
const Amount = require('./amount')

function Source(address, amount, tag, maxAmount){
	this.address = address
	this.amount = amount
	this.tag = tag
	this.maxAmount = maxAmount
}

function buildSource(address, amount, tag){
	let source = new Source(address, amount, tag, amount)
	if(tag === null || tag === undefined || tag === ''){
		return {address: source.address, maxAmount: Amount.buildAmount(source.maxAmount)}
	}
	else{
		return {address: source.address, tag: source.tag, maxAmount: Amount.buildAmount(source.maxAmount)}
	}
}

module.exports = {Source, buildSource}