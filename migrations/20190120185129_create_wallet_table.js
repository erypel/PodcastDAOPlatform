
exports.up = function(knex, Promise) {
	return knex.schema.createTable('wallet', function(table) {
		  table.increments('id').primary()
		  table.string('funds').notNullable().defaultTo('0.00000000')
		  table.string('destination_tag', 500)
		  table.string('source_tag', 500)
		   //.unsigned().notNullable() is the same as .increments() under the hood. It is necessary here
		  table.integer('owner_id').unsigned().notNullable().references('id').inTable('user').onDelete('NO ACTION').onUpdate('NO ACTION').defaultTo(1)
		  table.timestamps(false, true) //creates created_at and updated_at columns
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('wallet')
};
