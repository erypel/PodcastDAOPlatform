/**
 * This is the specification for Payment transactions. It specifies what a 
 * transaction should do
 */
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
	return new Specification(source, destination)
}

module.exports = { Specification, buildSpecification }