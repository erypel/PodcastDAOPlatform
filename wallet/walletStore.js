/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('../knexfile'))

module.exports = {
	getWalletID(ownerID){
		return knex.select('id').table('wallet').where('owner_id', ownerID).then(function(rowDataPacket){
			return rowDataPacket[0].id
		})
	},
	getUserBalance(ownerID){
		return knex.select('funds').table('wallet').where('owner_id', ownerID).then(function(rowDataPacket){
			return rowDataPacket[0].funds
		})
	},
	updateUserBalance(ownerID, newBalance){
		console.log("owner id:", ownerID)
		console.log("new balance:", newBalance)
		return knex('wallet').where({owner_id: ownerID}).update({funds: newBalance})
	},
	createWallet(ownerID){
		console.log(`Creating wallet for user with ID: ${ownerID}`)
		return knex('wallet').insert({
			owner_id: ownerID
		}).then(function (result) { //then() is necessary because it coerces the current query builder chain into a promise state
			console.log("Wallet successfully created.")
			return {success: true}
		})
	}
}