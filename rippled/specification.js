/**
 * This is the specification for Payment transactions. It specifies what a 
 * transaction should do
 */
const Source = require('./source')
const Dest = require('./destination')
function Specification(source, destination, allowPartialPayment = false, invoiceID = "", limitQuality = false, memos = [], noDirectRipple = false, paths = "") {
	this.source = source
	this.destination = destination
	this.allowPartialPayment = allowPartialPayment
	this.invoiceID = invoiceID
	this.limitQuality = limitQuality
	this.memos = memos
	this.noDirectRipple = noDirectRipple
	this.paths = paths
}

function buildSpecification(source, destination){
	let spec = new Specification(source, destination)
	return {source: source, destination: destination}
}

module.exports = { Specification, buildSpecification }