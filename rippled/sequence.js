/**
 * Every XRP Ledger account has a sequence number that is used to keep transactions 
 * in order. Every transaction must have a sequence number. A transaction can only
 * be executed if it has the next sequence number in order, of the account sending
 * it. This prevents one transaction from executing twice and transactions executing 
 * out of order. The sequence number starts at 1 and increments for each transaction 
 * that the account makes
 */
function Sequence(){
	this.sequence = 0
	this.increment = function(){
		this.sequence++
	}
}

module.exports = {
		Sequence
}