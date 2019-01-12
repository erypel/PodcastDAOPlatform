
exports.up = function(knex, Promise) {
	return knex.schema.createTable('rssmessage', function(table) {
		  table.increments('id').primary()
		  table.string('episodeName').notNullable().defaultTo('default')
		  table.string('description', 500)
		  table.string('path', 500)
		   //.unsigned().notNullable() is the same as .increments() under the hood. It is necessary here
		  table.integer('owner_id').unsigned().notNullable().references('id').inTable('user').onDelete('NO ACTION').onUpdate('NO ACTION').defaultTo(1)
		  table.integer('rssfeed_id').unsigned().notNullable().references('id').inTable('rssfeed').onDelete('CASCADE').onUpdate('NO ACTION').defaultTo(1)
		  table.integer('podcast_id').unsigned().notNullable().references('id').inTable('podcast').onDelete('CASCADE').onUpdate('CASCADE').defaultTo(1)
		  table.timestamps(false, true) //creates created_at and updated_at columns
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('rssmessage')
};
