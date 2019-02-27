/**
 * User Store integration tests go here
 */
const constants = require('../../constants')
const userStore = require('../../authentication/userStore')
const expect = require('chai').expect

function testUserStore() {
	return new Promise(function(resolve, reject) {
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
		resolve('done')
	})
}

module.exports = { testUserStore }