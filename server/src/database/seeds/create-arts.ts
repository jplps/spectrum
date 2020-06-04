import Knex from 'knex';

export async function seed(knex: Knex) {
	await knex('arts').insert([
		{ name: 'Visual' },
		{ name: 'Literature' },
		{ name: 'Performing' },
		{ name: 'Applied Arts' },
		{ name: 'Mutidisciplinary Works' },
	]);
}