/**
 * Currencies are represented as either 3-character currency codes or 40-character
 * uppercase hexadecimal strings. We recommend using uppercase ISO 4217 Currency 
 * Codes only. The string "XRP" is disallowed on trustlines because it is reserved
 * for the XRP Ledger's native currency. The following characters are permitted: 
 * all uppercase and lowercase letters, digits, as well as the symbols ?, !, @, #,
 * $, %, ^, &, *, <, >, (, ), {, }, [, ], and |.
 */
function Currency(code){
	this.code = code
	this.country = lookupCountry(code)
	/**
	 * Solely returns the currency code.
	 */
	this.toString = function(){
		return this.code
	}
}

function lookupCountry(code) {
	//TODO
	return ''
}

module.exports = {
		Currency
}