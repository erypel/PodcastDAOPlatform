/**
 * A value is a quantity of a currency represented as a decimal string. Be
 * careful: JavaScript's native number format does not have sufficient precision
 * to represent all values. XRP has different precision from other currencies.
 * 
 * XRP has 6 significant digits past the decimal point. In other words, XRP
 * cannot be divided into positive values smaller than 0.000001 (1e-6). This
 * smallest unit is called a "drop". XRP has a maximum value of 100000000000
 * (1e11). Some RippleAPI methods accept XRP in order to maintain compatibility
 * with older versions of the API. For consistency with the rippled APIs, we
 * recommend formally specifying XRP values in drops in all API requests, and
 * converting them to XRP for display. This is similar to Bitcoin's satoshis and
 * Ethereum's wei. 1 XRP = 1,000,000 drops.
 * 
 * Non-XRP values have 16 decimal digits of precision, with a maximum value of
 * 9999999999999999e80. The smallest positive non-XRP value is 1e-81.
 */
function Value(value){
	this.value = value
}

module.exports = {
		Value
}