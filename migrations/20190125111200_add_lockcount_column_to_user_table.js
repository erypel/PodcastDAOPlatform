
exports.up = function(knex, Promise) {
	 return knex.schema.alterTable('user', function(table){
		 table.integer('lock_count').defaultTo(0).after('encrypted_password')
	 })
};

exports.down = function(knex, Promise) {
	return knex.schema.table('user', t => {
		  t.dropColumn('lock_count')
	  })
};
