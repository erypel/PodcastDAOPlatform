exports.up = function(knex, Promise) {
  return knex.schema.alterTable('escrow', function(table){
	  table.integer('campaign_id').unsigned().notNullable().references('id').inTable('adcampaign').after('ad_id').onDelete('NO ACTION').onUpdate('NO ACTION').defaultTo(1)
  })
};

exports.down = function(knex, Promise) {
	return knex.schema.table('escrow', t => {
		  t.dropColumn('campaign_id')
	  })
};