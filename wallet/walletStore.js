/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('../knexfile'))
const logger = require('../utils/logger')(__filename)

function getWalletID(ownerID){
	return knex.select('id').table('wallet').where('owner_id', ownerID).then(function(rowDataPacket){
		return rowDataPacket[0].id
	})
}

function getUserBalance(ownerID){
	return knex.select('funds').table('wallet').where('owner_id', ownerID).then(function(rowDataPacket){
		return rowDataPacket[0].funds
	})
}

function getWalletBalance(walletID){
	return knex.select('funds').table('wallet').where('id', walletID).then(function(rowDataPacket){
		return rowDataPacket[0].funds
	})
}

function updateWalletBalance(walletID, newBalance){
	return knex('wallet').where({id: walletID}).update({funds: newBalance})
}

function updateUserBalance(ownerID, newBalance){
	console.log("owner id:", ownerID)
	console.log("new balance:", newBalance)
	return knex('wallet').where({owner_id: ownerID}).update({funds: newBalance})
}

function createWallet(ownerID){
	logger.info('Creating wallet for user with ID::' + ownerID)
	return knex('wallet').insert({
		owner_id: ownerID
	}).then(function (result) {
		logger.info('Created wallet with ID::' + result[0] + 'for userID::' + ownerID)
		return {success: true}
	})
}

function createTestWallet(){}

function deleteTestWallet(){}

module.exports = {
	getWalletID,
	getUserBalance,
	getWalletBalance,
	updateUserBalance,
	updateWalletBalance,
	createWallet
}