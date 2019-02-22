/**
 * 	The destination of the funds to be sent.
 */
const Amount = require('./amount')

function Destination(address, amount, tag, minAmount){
	this.address = address
	this.amount = amount
	this.tag = tag
	this.minAmount = minAmount
}

function buildDestination(address, amount, tag){
	let destination = new Destination(address, amount, tag, amount)
	if(tag === null || tag === undefined || tag === ''){
		return {address: destination.address, amount: Amount.buildAmount(destination.amount)}
	}
	else{
		return {address: destination.address, amount: Amount.buildAmount(destination.amount), tag: destination.tag}
	}
}

module.exports = {Destination, buildDestination}