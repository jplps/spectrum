import Knex from 'knex';

export async function up(knex: Knex) {
	return knex.schema.createTable('labs_arts', table => {
		table.increments('id').primary();
		table.integer('lab_id')
			.notNullable()
			.references('id')
			.inTable('labs');
		table.integer('art_id')
			.notNullable()
			.references('id')
			.inTable('arts');
	});
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('labs_arts');
}