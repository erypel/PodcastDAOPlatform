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
const NUM_PASSES = 3; // number of passes for stirring function

//Defaulting to all 0's
const spice = [
		BigNumber(0),
		BigNumber(0),
		BigNumber(0),
		BigNumber(0),
		BigNumber(0),
		BigNumber(0),
		BigNumber(0),
		BigNumber(0)
]

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
	stir(KX)
	
	/*
	 * finish up key expansion by copying the first 30 words of the array onto
	 * the end. This allows code that references the KX array to wrap around array
	 * indexes mod 256 without having to mask the index to the low-order 8 bits.
	 */
	for(let i = 0; i < 30; i++)
	{
		KX[256 + i] = KX[i]
	}
	
	return KX
}

/**
 * The purpose of the Stirring function is to pseudo-randomize the KX array,
 * allowing each bit to influence every other bit.
 * 
 * The function does several passes of the KX array, altering every word. The
 * default number of passes is 3. 
 * 
 * Yet to be implemented is the backup feature causing additional passes.
 * The number of extra passes is the sum of the global backup variable BACKUP
 * and the array entry BACKUPSUBCIPHER[0]. Normally both values are 0. As of 
 * right now, it is not necessary to implement this.
 */
function stir(KX) {
	/*
	 * The stirring function has 8 internal state variables, each an unsigned 64 bit
	 * word. Before the first pass of the KX array, they are initialized from
	 * the last 8 values in the array.
	 */
	let s0 = KX[248], s1 = KX[249], s2 = KX[250], s3 = KX[251], s4 = KX[252], s5 = KX[253], s6 = KX[254],
			s7 = KX[255];
	
	for(let j = 0; j < NUM_PASSES; j++)
	{
		/*
		 * One pass of the KX array: Each word in the KX array is mixed with the state
		 * variables, starting with KX[0] and working through KX[255]. Each array word
		 * is overwritten after mixing. The missing function is deliberately made
		 * slightly lossy so that the process cannot be run backward to discover the
		 * pre-stirred KX value, and hence the key.
		 */
		for(let i = 0; i < NUM_WORDS; i++)
		{
			// Perform the individual word stirring algorithm
			// BigInteger is immutable so need to reassign values like this:
			s0 = s0.uxor((KX[i].uxor(KX[(i + 83).uand(255)]).add(KX[s0.uand(255)]).umod(MOD))); // sometimes lossy
			s2 = s2.add(KX[i]).umod(MOD); // necessary to prevent Wagner equivalent key problem
			s1 = s1.add(s0).umod(MOD);
			s3 = s3.uxor(s2);
			s5 = s5.sub(s4).umod(MOD);
			s7 = s7.uxor(s6);
			s3 = s3.add(s0.ushrn(13)).umod(MOD);
			s4 = s4.uxor(s1.ushln(11));
			s5 = s5.uxor(s3.ushln(s1.uand(31)));
			s6 = s6.add(s2.ushrn(17)).umod(MOD);
			s7 = s7.uor(s3.add(s4).umod(MOD)); // lossy
			s2 = s2.sub(s5).umod(MOD); // cross-link
			s0 = s0.sub(s6.uxor(i)).umod(MOD);
			s1 = s1.uxor(s5.add(PI19).umod(MOD));
			s2 = s2.add(s7.ushrn(j)).umod(MOD);
			s2 = s2.uxor(s1);
			s4 = s4.sub(s3).umod(MOD);
			s6 = s6.uxor(s5);
			s0 = s0.add(s7).umod(MOD);
			KX[i] = s2.add(s6).umod(MOD);
		}
	}
}

/**
 * The encryption method for words of 36 - 64 bits. In this program, we plan on 
 * only using this method for mapping XRP destination tags, so it will be used 
 * for 10 digit Long values which should be 64 bits long.
 * @param plaintextDestTag: a Long value we want encrypted
 * @param KX: the key expansion table used for encryption
 * @return an encrypted value
 * @throws Exception 
 */
function encryptHPCShort(plaintext) {
	let KX = createKeyExpansionTable(2, 10);
	let blocksize = 64;
	
	/*
	 * 	The plaintext is placed right-justified in variable s0.  LMASK is set
	 *	to a block of 1s, to mask s0 to the valid bits between operations.
	 */
	let s0 = BigNumber(plaintext, 2)
	let lmask = BigNumber('0xffffffffffffffff', 2);
	
	// A word from the KX array, KX[blocksize], is added to s0.
	s0 = KX[blocksize].add(s0).umod(MOD);
	s0.uand(lmask);
	
	// Several shift sizes are calculated:
	let LBH = BigNumber((blocksize + 1) / 2); //division rounds down
	let LBQ = (LBH.add(1)).div(2);
	let LBT = (LBQ.add(blocksize)).div(4).add(2);
	let GAP = 64 - blocksize;
	
	/*
	 * Then 8 rounds of mixing are run with round index i going from 0...7
	 * After the mixing, another word from KX, KX[blocksize + 8] is added to s0
	 * s0 is masked, and the valid bits are written to the output array.
	 * Any high-order bits in the output array are unchanged.
	 */
	for(let i = 0; i < 8; i++)
	{
		let k = KX[s0.uand(255)].add(spice[i]);
		k.uand(lmask);
		s0 = s0.add(k.ushln(8)).umod(MOD);
		s0 = s0.uand(lmask);
		s0 = s0.uxor((k.ushrn(GAP)).uand(~255));
		s0 = s0.uand(lmask);
		s0 = s0.add(s0.ushln(LBH + i)).umod(MOD);
		s0 = s0.uand(lmask);
		let t = spice[(i ^ 7)];
		s0 = s0.uxor(t);
		s0 = s0.sub(t.ushrn(GAP + i)).umod(MOD);
		s0 = s0.add(t.ushrn(13)).umod(MOD);
		s0 = s0.uxor(s0.ushrn(LBH));
		s0 = s0.uand(lmask);
		t = s0.uand(255);
		k = KX[t];
		k = k.uxor(spice[(i ^ 4)]);
		k = k.uand(lmask);
		k = KX[t+3*i+1].add(k.ushrn(23)).add(k.ushln(41)).umod(MOD);
		k = k.uand(lmask);
		s0 = s0.uxor(k.ushln(8)).umod(MOD);
		s0 = s0.uand(lmask);
		s0 = s0.sub(k.ushrn(GAP).uand(~255)).umod(MOD);
		s0 = s0.uand(lmask);
		s0 = s0.sub(s0.ushln(LBH)).umod(MOD);
		s0 = s0.uand(lmask);
		t = spice[(i ^ 1)].uxor(PI19.add(blocksize).umod(MOD));
		s0 = s0.add(t.ushln(3)).umod(MOD);
		s0 = s0.uand(lmask);
		s0 = s0.uxor(t.ushrn(GAP+2));
		s0 = s0.uand(lmask);
		s0 = s0.sub(t).umod(MOD);
		s0 = s0.uand(lmask);
		s0 = s0.uxor(s0.ushrn(LBQ));
		s0 = s0.uand(lmask);
		let and = s0.uand(15);
		s0 = s0.add(permb[and]).umod(MOD);
		s0 = s0.uand(lmask);
		t = spice[(i^2)];
		s0 = s0.uxor(t.ushrn(GAP+4));
		s0 = s0.uand(lmask);
		s0 = s0.add(s0.ushln(LBT + s0.uand(15))).umod(MOD);
		s0 = s0.uand(lmask);
		s0 = s0.add(t).umod(MOD);
		s0 = s0.uand(lmask);
		s0 = s0.uxor(s0.ushrn(LBH));
		s0 = s0.uand(lmask);
	}
	
	return s0;
}