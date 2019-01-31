
exports.up = function(knex, Promise) {
	 return knex.schema.alterTable('adcampaign', function(table){
		  table.string('title')
		  table.string('description').after('title')
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.table('adcampaign', t => {
		  t.dropColumn('title')
		  t.dropColumn('description')
	  })
};
