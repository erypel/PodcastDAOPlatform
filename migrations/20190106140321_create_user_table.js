
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(table) {
	  table.increments('id').primary()
	  table.string('username').notNullable()
	  table.string('password').notNullable()
	  table.string('email')
	  table.timestamps(false, true) //creates created_at and updated_at columns
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user')
};
