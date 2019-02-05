const constants = require('../constants')

exports.up = function(knex, Promise) {
	 return knex.schema.alterTable('user', function(table){
		  table.string('profile').defaultTo(constants.CONTENT_CREATOR_USER_PROFILE) //TODO this should ideally have a check constraint, but MySQL doesn't support those and neither does knex
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.table('user', t => {
		  t.dropColumn('profile')
	  })
};
