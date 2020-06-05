import { Request, Response } from 'express';
import knex from '../database/connection';

class LabsController {
	async index(req: Request, res: Response) {
		const { city, state } = req.query;

		// const parsedArts = String(arts)
		// 	.split(',')
		// 	.map(art => Number(art.trim()));

		try {
			const labs = await knex('labs')
				// .join('labs_arts', 'labs.id', '=', 'labs_arts.lab_id')
				// .whereIn('labs_arts.art_id', parsedArts)
				.where('city', String(city))
				.where('state', String(state))
				.distinct() // No repeated results
				.select('*');

			const serializedLabs = labs.map(lab => {
				return {
					...lab,
					image_url: `http://localhost:4000/uploads/${lab.image}`,
				};
			});

			return res.status(200).json(serializedLabs);
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

			const serializedLab = {
				...lab,
				image_url: `http://localhost:4000/uploads/${lab.image}`,
			};

			const arts = await knex('arts')
				.join('labs_arts', 'arts.id', '=', 'labs_arts.category_id')
				.where('labs_arts.lab_id', id)
				.select('arts.name');

			return res.status(200).json({ lab: serializedLab, arts });
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
			// Inserting filename to set the route
			title, image: req.file.filename, latitude, longitude, state, city, date, time
		});

		const lab_id = insertedIds[0];

		const labArts = arts
			.split(',')
			.map((art: string) => Number(art.trim()))
			.map((art_id: number) => {
				return { lab_id, art_id };
			});

		await trx('labs_arts').insert(labArts);

		// Run commit to end transactions
		await trx.commit();

		return res.status(200).json({ success: true });
	}
}

export default LabsController;