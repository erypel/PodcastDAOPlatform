
exports.up = function(knex, Promise) {
	return knex.schema.createTable('comment', function(table) {
		  table.increments('id').primary()
		  //TODO string length defaults to 255. Probably want to increase eventually
		  table.string('comment')
		  table.integer('comment_id').defaultTo(-1) //If this is a comment in response to another comment, this is the ID of the comment that this comment is in response to
		  //.unsigned().notNullable() is the same as .increments() under the hood. It is necessary here
		  table.integer('podcast_id').unsigned().notNullable().references('id').inTable('podcast').onDelete('NO ACTION').onUpdate('NO ACTION').defaultTo(1)
		  table.integer('commenter_id').unsigned().notNullable().references('id').inTable('user').onDelete('NO ACTION').onUpdate('NO ACTION').defaultTo(1)
		  table.timestamps(false, true) //creates created_at and updated_at columns
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('comment')
};
