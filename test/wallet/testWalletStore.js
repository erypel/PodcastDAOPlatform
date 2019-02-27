/**
 * Integration tests for the wallet store go here
 */
const expect = require('chai').expect
const crypto = require('crypto')
const assert = require('assert')
const constants = require('../../constants')
const userStore = require('../../authentication/userStore')
const walletStore = require('../../wallet/walletStore')
const Wallet = require('../../wallet/wallet')

function testWalletStore() {
	return new Promise(function(resolve, reject){
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

		describe('deleteWallet(walletID)', function() {
			it('Should delete the specified wallet', function(done) {
				// ARRANGE
				let userID = -1
				let walletID = -1
				let expectNumberOfRowsDeleted = 1
				userStore.deleteTestUsers().then(() => {
					return
				}).then(() => {
					// create a test user
					return userStore.createTestUser().then(id =>{
						userID = id
						return
					})
				}).then(() => {
					return walletStore.createWallet(userID)
				}).then(result => {
					walletID = result.id
					return
				}).then(() => {
					//ACT
					return walletStore.deleteWallet(walletID)
				}).then(result => {
					//ASSERT
					expect(expectNumberOfRowsDeleted).to.be.equal(result)
					return
				}).then(() => {
					return userStore.deleteTestUsers()
				}).then(() => {
					done()
				})
			})
		})

		describe('Test that getWallet() returns an object', function() {
			it('Should return an object', function(done){
				// ARRANGE
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
					expect(wallet).to.be.an('object')
					return wallet
				}).then(wallet => {
					//CLEANUP
					console.log('wallet', wallet)
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

		describe('getWalletID(ownerID)', function() {
			it('Should get the ID of a user\'s wallet', function(done) {
				// ARRANGE
				let expectedWalletID = -1
				let userID = -1
				userStore.deleteTestUsers().then(() => {
					return
				}).then(() => {
					// create a test user
					return userStore.createTestUser().then(id =>{
						userID = id
						return id
					})
				}).then(id => {
					return walletStore.createWallet(id)
				}).then(result => {
					expectedWalletID = result.id
					return
				}).then(() => {
					//ACT
					return walletStore.getWalletID(userID)
				}).then(walletID => {
					//ASSERT
					expect(expectedWalletID).to.be.equal(walletID)
					return expectedWalletID
				}).then(walletID => {
					//CLEANUP
					walletStore.deleteWallet(walletID).then(() => {
						return
					}).then(() => {
						return userStore.deleteTestUsers()
					}).then(() => {
						done()
					})
				})
			})
		})

		describe('getUserBalance(ownerID)', function() {
			it('Should return the balance of a newly created wallet', function(done) {
				// ARRANGE
				let expectedValue = '0.00000000'
					let walletID = -1
					let userID = -1
					userStore.deleteTestUsers().then(() => {
						return
					}).then(() => {
						// create a test user
						return userStore.createTestUser().then(id => {
							userID = id
						})
					}).then(() => {
						return walletStore.createWallet(userID).then(result => {
							walletID = result.id
							return
						})
					}).then(() => {
						//ACT
						return walletStore.getUserBalance(userID)
					}).then(funds => {
						//ASSERT
						expect(expectedValue).to.be.equal(funds)
						return
					}).then(() => {
						//CLEANUP
						walletStore.deleteWallet(walletID).then(() => {
							return
						}).then(() => {
							return userStore.deleteTestUsers()
						}).then(() => {
							done()
						})
					})
			})
		})

		describe('getWalletBalance(walletID)', function() {
			it('Should return the balance of a newly created wallet', function(done) {
				// ARRANGE
				let expectedValue = '0.00000000'
					let walletID = -1
					let userID = -1
					userStore.deleteTestUsers().then(() => {
						return
					}).then(() => {
						// create a test user
						return userStore.createTestUser().then(id => {
							userID = id
						})
					}).then(() => {
						return walletStore.createWallet(userID).then(result => {
							walletID = result.id
							return
						})
					}).then(() => {
						//ACT
						return walletStore.getWalletBalance(walletID)
					}).then(funds => {
						//ASSERT
						expect(expectedValue).to.be.equal(funds)
						return
					}).then(() => {
						//CLEANUP
						walletStore.deleteWallet(walletID).then(() => {
							return
						}).then(() => {
							return userStore.deleteTestUsers()
						}).then(() => {
							done()
						})
					})
			})
		})

		describe('updateWalletBalance(walletID, newBalance)', function() {
			it('Should update the balance of a wallet', function(done) {
				// ARRANGE
				let expectedValue = '0.00000001'
					let walletID = -1
					let userID = -1
					userStore.deleteTestUsers().then(() => {
						return
					}).then(() => {
						// create a test user
						return userStore.createTestUser().then(id => {
							userID = id
						})
					}).then(() => {
						return walletStore.createWallet(userID).then(result => {
							walletID = result.id
							return
						})
					}).then(() => {
						//ACT
						return walletStore.updateWalletBalance(walletID, expectedValue)
					}).then(() => {
						return walletStore.getWalletBalance(walletID)
					}).then(funds => {
						//ASSERT
						expect(expectedValue).to.be.equal(funds)
						return
					}).then(() => {
						//CLEANUP
						walletStore.deleteWallet(walletID).then(() => {
							return
						}).then(() => {
							return userStore.deleteTestUsers()
						}).then(() => {
							done()
						})
					})
			})
		})

		describe('updateUserBalance(ownerID, newBalance)', function() {
			it('Should update the balance of a user\'s wallet', function(done) {
				// ARRANGE
				let expectedValue = '0.00000001'
					let walletID = -1
					let userID = -1
					userStore.deleteTestUsers().then(() => {
						return
					}).then(() => {
						// create a test user
						return userStore.createTestUser().then(id => {
							userID = id
						})
					}).then(() => {
						return walletStore.createWallet(userID).then(result => {
							walletID = result.id
							return
						})
					}).then(() => {
						//ACT
						return walletStore.updateUserBalance(userID, expectedValue)
					}).then(() => {
						return walletStore.getWalletBalance(walletID)
					}).then(funds => {
						//ASSERT
						expect(expectedValue).to.be.equal(funds)
						return
					}).then(() => {
						//CLEANUP
						walletStore.deleteWallet(walletID).then(() => {
							return
						}).then(() => {
							return userStore.deleteTestUsers()
						}).then(() => {
							done()
						})
					})
			})
		})
		resolve('done')
	})
}

module.exports = { testWalletStore }