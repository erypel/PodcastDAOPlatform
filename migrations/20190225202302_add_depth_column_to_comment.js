
exports.up = function(knex, Promise) {
	return knex.schema.alterTable('comment', function(table){
		  table.integer('depth').defaultTo(0)
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.table('comment', t => {
		  t.dropColumn('depth')
	  })
};
