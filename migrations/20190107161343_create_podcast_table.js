
exports.up = function(knex, Promise) {
	return knex.schema.createTable('podcast', function(table) {
		  table.increments('id').primary()
		  table.string('episode_name').notNullable().defaultTo("unnamed")
		  table.string('description', 500)
		  table.string('path', 500)
		  //.unsigned().notNullable() is the same as .increments() under the hood. It is necessary here
		  table.integer('owner_id').unsigned().notNullable().references('id').inTable('user').onDelete('NO ACTION').onUpdate('NO ACTION').defaultTo(1)
		  table.timestamps(false, true) //creates created_at and updated_at columns
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('podcast')
};
