
exports.up = function(knex, Promise) {
	 return knex.schema.alterTable('adcampaign', function(table){
		  table.renameColumn('curr_amout', 'curr_amount')
		  table.renameColumn('init_amout', 'init_amount')
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.alterTable('adcampaign', function(table){
		  table.renameColumn('curr_amount', 'curr_amout')
		  table.renameColumn('init_amount', 'init_amout')
	  })
};
