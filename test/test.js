const expect = require('chai').expect
const crypto = require('crypto')
const assert = require('assert')
const constants = require('../constants')
const wallet = require('./wallet/testWalletStore')
const authentication = require('./authentication/testUserStore')

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

// BEGIN AUTHENTICATION TESTS
authentication.testUserStore().then(() => {
// BEGIN WALLET TESTS
	return wallet.testWalletStore()
})