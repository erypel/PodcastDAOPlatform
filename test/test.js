var expect = require('chai').expect;
var crypto = require('crypto')
const assert = require('assert');

function test(){
	return 1
}

describe('test()', function() {
	it('should return 1', function() {
		//ARRANGE
		let expected = 1
		
		//ACT
		let val = test()
		
		//ASSERT
		expect(val).to.be.equal(expected)
	})
})

describe('Check crypto Hashes for sha256', function() {
	it('Hashes should include sha256', function() {
		// ARRANGE
		
		//ACT
		
		//ASSERT
		expect(crypto.getHashes().includes('sha256')).to.be.equal(true)
	})
})

describe('Check crypto Hashes for ripemd160', function() {
	it('Hashes should include ripemd160', function() {
		// ARRANGE
		
		//ACT
		
		//ASSERT
		expect(crypto.getHashes().includes('ripemd160')).to.be.equal(true)
	})
})