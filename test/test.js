const expect = require('chai').expect
const crypto = require('crypto')
const assert = require('assert')
const constants = require('../constants')
const userStore = require('../authentication/userStore')
const walletStore = require('../wallet/walletStore')

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

describe('Testing that createTestUser() creates a test user', function() {
	return it('A user should be created with the test parameters', function(done) {
		// ARRANGE
		let expectedUsername = constants.USERNAME_FOR_TESTING
		let expectedEmail = constants.EMAIL_FOR_TESTING
		let expectedProfile = constants.PROFILE_FOR_TESTING
		userStore.deleteTestUsers().then( () => {
			return
		}).then(() => {
			//ACT
			userStore.createTestUser().then(id => {
				return userStore.getUserByID(id)
			}).then(user => {
				//ASSERT
				expect(user.username).to.be.equal(expectedUsername)
				expect(user.email).to.be.equal(expectedEmail)
				expect(user.profile).to.be.equal(expectedProfile)
				
				//CLEAN UP
				userStore.deleteTestUsers().then(() => {
					done()
				})
			})	
		})
	})
})

describe('Test that deleteTestUsers() deletes all test users', function() {
	it('3 test users should be deleted after creating 3 test users', function(done) {
		// ARRANGE
		let expected = 3
		userStore.deleteTestUsers().then(() => {
			return
		}).then(() => {
			//create 3 test users
			userStore.createTestUser().then(() => {
				userStore.createTestUser()
			}).then(() => {
				userStore.createTestUser()
			}).then(() => {
				//ACT
				userStore.deleteTestUsers().then(result => {
					//ASSERT
					expect(result).to.be.equal(expected)
					done()
				})
			})
		})
	})
})

// END AUTHENTICATION TESTS

// BEGIN WALLET TESTS

describe('Test that createWallet() creates a wallet for a user', function() {
	it('Should create a wallet linked to a user ID', function(done) {
		// ARRANGE
		let expectedUserID = -1
		userStore.deleteTestUsers().then(() => {
			return
		}).then(() => {
			// create a test user
			return userStore.createTestUser().then(id =>{
				expectedUserID = id
				return id
			})
		}).then(id => {
			//ACT
			return walletStore.createWallet(id)
		}).then(result => {
			let walletID = result.id
			return walletID
		}).then(walletID => {
			return walletStore.getWallet(walletID)
		}).then(wallet => {
			//ASSERT
			expect(expectedUserID).to.be.equal(wallet.owner_id)
			return wallet
		}).then(wallet => {
			//CLEANUP
			walletStore.deleteWallet(wallet.id).then(() => {
				return
			}).then(() => {
				return userStore.deleteTestUsers()
			}).then(() => {
				done()
			})
		})
	})
})

// END WALLET TESTS