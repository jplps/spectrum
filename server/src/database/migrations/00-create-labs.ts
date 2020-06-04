import Knex from 'knex';

export async function up(knex: Knex) {
	return knex.schema.createTable('labs', table => {
		table.increments('id').primary();
		table.string('image').notNullable();
		table.string('title').notNullable();
		table.decimal('latitude').notNullable();
		table.decimal('longitude').notNullable();
		table.string('state').notNullable();
		table.string('city').notNullable();
		table.date('date').notNullable();
		table.time('time').notNullable();
	});
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('labs');
}