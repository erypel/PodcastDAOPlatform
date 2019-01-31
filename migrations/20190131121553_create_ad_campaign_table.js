exports.up = function(knex, Promise) {
	return knex.schema.createTable('adcampaign', function(table) {
		  table.increments('id').primary()
		  table.string("init_amout").notNullable().defaultTo('0.000000')
		  table.string("curr_amout").notNullable().defaultTo('0.000000')
		  table.string('pay_per_view').notNullable().defaultTo('0.000000')
		  table.string('allow_cancel_after') //TODO will want this to be a datetime. which format, I'm not sure yet
		  table.string('allow_execute_after') //TODO see above
		  //.unsigned().notNullable() is the same as .increments() under the hood. It is necessary here
		  table.integer('ad_id').unsigned().notNullable().references('id').inTable('advertisement').onDelete('NO ACTION').onUpdate('NO ACTION').defaultTo(1)
		  table.integer('user_id').unsigned().notNullable().references('id').inTable('user').onDelete('NO ACTION').onUpdate('NO ACTION').defaultTo(1)
		  table.timestamps(false, true) //creates created_at and updated_at columns
	  })
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('adcampaign')
};
