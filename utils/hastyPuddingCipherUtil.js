/**
 * This is an implementation of the Hasty Pudding Cipher. This algorithm will be
 * used to map User's Wallets to destination tags for the platform's shared XRP
 * wallet. The specs for HPC can be found here:
 * http://richard.schroeppel.name:8015/hpc/hpc-spec
 * 
 * I am using HPC as per the recommendation here:
 * https://developers.ripple.com/become-an-xrp-ledger-gateway.html#generating-source-and-destination-tags
 * 
 * @author Evan
 *
 */
const BigNumber = require('bn.js') //Javascript represents numbers using IEEE-754 double precision (64-bit) format. This gives 53 bits of precision. We want to use 64 bits of precision, so we need this library.

const keyValues = new Map()

// A few internal "random" numbers used in the cipher:
const PI19 = BigNumber('3141592653589793238', 2)
const E19 = BigNumber('2718281828459045235', 2)
const R220 = BigNumber('14142135623730950488', 2)

// a few helpful variables
const NUM_WORDS = 256;
const MOD = BigNumber('2', 2).pow(64) //applied to all addition, subtraction, multiplication
 
/**
	 * Key Expansion (KX) Tables
	 *
	 * Each subcipher has a KX (key expansion) table, 256 words of 64-bits,
	 * pseudo-randomly generated from the key. All five tables may be computed when
	 * a key is setup, or the tables may be computed when needed. An application
	 * which only used a few blocksizes would need only a subset of the tables. The
	 * same algorithm is used for each KX table, changing only an initialization.
	 * The KX tables are firewalled: knowing a KX table won't help find the original
	 * key, or a KX table for a different subcipher.
	 *
	 * Each KX table is followed by 30 words which are a copy of the first 30 words.
	 * This allows the cipher to reference the tables as if the index were wrapped
	 * mod 256.
	 * 
	 * @param subCipherNumber: the sub-cipher number (from 1 to 5, 1 is HPC-Tiny)
	 *        Hasty Pudding consists of 5 different sub-ciphers. The blocksize
	 *        controls which sub-cipher is used. Each sub-cipher uses its own key
	 *        expansion (KX) table, derived from the key. FOR NOW ONLY 2 SHOULD EVER
	 *        BE USED!!!
	 *
	 *
	 *        1 HPC-Tiny 0 - 35 bits 
	 *        2 HPC-Short 36 - 64 bits 
	 *        3 HPC-Medium 65 - 128 bits
	 *        4 HPC-Long 129 - 512 bits 
	 *        5 HPC-Extended 513+ bits
	 * @param keyLength: the key length in bits (a non-negative integer)
	 */
function createKeyExpansionTable(subCipherNumber, keyLength) {
	let KX = []
	let subcipherBits = [35, 64, 128, 512, 1024]
	
	// The first 3 words of the KX array are intialized:
	KX[0] = PI19.add(subCipherNumber)
	KX[1] = E19.mul(keyLength)
	KX[2] = R220.ushln(subcipherBits[subCipherNumber - 1])
	
	/*
	 * The remaining 253 words of the array are pseudo-randomly filled in with the
	 * equation
	 * 
	 * KX[i] = KX[i - 1] + (KX[i-2] XOR (KX[i-3] right shift 23) XOR (KX[i-3] left
	 * shift 41))
	 */
	for(let i = 3; i < NUM_WORDS; i++){
		KX[i] = KX[i - 1].add(KX[i - 2].uxor(KX[i - 3].ushrn(23)).uxor(KX[i - 3].ushln(41))).umod(MOD)
	}
	
	// TODO? I don't think we'll ever need this many words
	/*
	 * For very long keys: After 128 words of key have been xored into the KX array,
	 * the Stirring function is run. If there is more key to use, the next 128 words
	 * are xored into the stirred KX array, starting over at word 0 of KX. (No key
	 * is ever xored directly into the second half of the KX array, but these bits
	 * are affected by the stirring function.)
	 */
	
	// pseudo randomize the KX array
	stir(KX);
	
	/*
	 * finish up key expansion by copying the first 30 words of the array onto
	 * the end. This allows code that references the KX array to wrap around array
	 * indexes mod 256 without having to mask the index to the low-order 8 bits.
	 */
	for(let i = 0; i < 30; i++)
	{
		KX[256 + i] = KX[i];
	}
	
	return KX;
}

function stir(KX) {
	
}