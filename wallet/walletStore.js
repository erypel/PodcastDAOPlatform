/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('../knexfile'))
const constants = require('../constants')
const logger = require('../utils/logger')(__filename)

function getWallet(walletID){
	return knex.select().table(constants.WALLET_TABLE).where('id', walletID).first()
}

function getWalletID(ownerID){
	return knex.select('id').table(constants.WALLET_TABLE).where('owner_id', ownerID).then(function(rowDataPacket){
		return rowDataPacket[0].id
	})
}

function getUserBalance(ownerID){
	return knex.select('funds').table(constants.WALLET_TABLE).where('owner_id', ownerID).then(function(rowDataPacket){
		return rowDataPacket[0].funds
	})
}

function getWalletBalance(walletID){
	return knex.select('funds').table(constants.WALLET_TABLE).where('id', walletID).then(function(rowDataPacket){
		return rowDataPacket[0].funds
	})
}

function updateWalletBalance(walletID, newBalance){
	return knex(constants.WALLET_TABLE).where({id: walletID}).update({funds: newBalance})
}

function updateUserBalance(ownerID, newBalance){
	console.log("owner id:", ownerID)
	console.log("new balance:", newBalance)
	return knex(constants.WALLET_TABLE).where({owner_id: ownerID}).update({funds: newBalance})
}

function createWallet(ownerID){
	logger.info('Creating wallet for user with ID::' + ownerID)
	return knex(constants.WALLET_TABLE).insert({
		owner_id: ownerID
	}).then(function (result) {
		logger.info('Created wallet with ID::' + result[0] + ' for userID::' + ownerID)
		return {success: true, id: result[0]}
	})
}

/**
 * THIS FUNCTION SHOULD REALLY ONLY BE USED FOR TESTING
 * @param id
 * @returns
 */
function deleteWallet(id){
	logger.warn('Deleting wallet with id::' + id)
	return knex(constants.WALLET_TABLE).where({id: id}).del().then(result => {
		if(result === 0){
			logger.warn('No wallet was deleted.')
		}
		else if(result > 1){
			logger.error(result + ' wallets were deleted. Something is very broken. Only ONE should have been deleted')
		}
		else{
			logger.debug('Successfully deleted ONE wallet')
		}
		return result
	})
}

module.exports = {
	getWallet,
	getWalletID,
	getUserBalance,
	getWalletBalance,
	updateUserBalance,
	updateWalletBalance,
	createWallet,
	deleteWallet
}