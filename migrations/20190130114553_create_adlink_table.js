
exports.up = function(knex, Promise) {
	return knex.schema.createTable('adlink', function(table) {
		  table.increments('id').primary()
		  //.unsigned().notNullable() is the same as .increments() under the hood. It is necessary here
		  table.integer('ad_id').unsigned().notNullable().references('id').inTable('advertisement').onDelete('NO ACTION').onUpdate('NO ACTION').defaultTo(1)
		  table.integer('podcast_id').unsigned().notNullable().references('id').inTable('podcast').onDelete('NO ACTION').onUpdate('NO ACTION').defaultTo(1)
		  table.integer('escrow_id').notNullable().defaultTo('0') //TODO will eventually be a foreign key
		  table.timestamps(false, true) //creates created_at and updated_at columns
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('adlink')
};
