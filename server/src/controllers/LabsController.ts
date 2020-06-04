import { Request, Response } from 'express';
import knex from '../database/connection';

class LabsController {
	async index(req: Request, res: Response) {
		const { city, state, arts } = req.query;

		const parsedArts = String(arts)
			.split(',')
			.map(art => Number(art.trim()));

		try {
			const labs = await knex('labs')
				.join('labs_arts', 'lab.id', '=', 'labs_arts.lab_id')
				.whereIn('labs_labs.lab_id', parsedArts)
				.where('city', String(city))
				.where('state', String(state))
				.distinct(); // No repeated results

			return res.status(200).json(labs);
		} catch (err) {
			return res.status(400).json({ err });
		}
	}

	async show(req: Request, res: Response) {
		const { id } = req.params;

		try {
			const lab = await knex('labs').where('id', id).first();

			if (!lab) {
				return res.status(400).json({ err: 'LAB not found.' });
			}

			const arts = await knex('arts')
				.join('labs_arts', 'arts.id', '=', 'labs_arts.category_id')
				.where('labs_arts.lab_id', id)
				.select('arts.name');

			return res.status(200).json({ lab, arts });
		} catch (err) {
			return res.status(400).json({ err });
		}
	}

	async create(req: Request, res: Response) {
		const {
			title, latitude, longitude, state, city, date, time, arts
		} = req.body;

		const trx = await knex.transaction();

		const insertedIds = await trx('labs').insert({
			title, image: 'fake', latitude, longitude, state, city, date, time
		});

		const lab_id = insertedIds[0];

		const labArts = arts.map((art_id: Number) => {
			return { lab_id, art_id };
		});

		await trx('labs_arts').insert(labArts);

		await trx.commit(); // Run commit to end transactions

		return res.status(200).json({ success: true });
	}
}

export default LabsController;