
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('rssfeed', function(table){
	  table.boolean('explicit').defaultTo(false).after('description')
  })
};

exports.down = function(knex, Promise) {
	return knex.schema.table('rssfeed', t => {
		  t.dropColumn('explicit')
	  })
};
