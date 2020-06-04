import { Request, Response } from 'express';
import knex from '../database/connection';

class ArtsController {
	async index(req: Request, res: Response) {
		try {
			const categoryList = await knex('arts').select('*');
			// const serializedArts = categoryList.map(({ name }) => name);

			return res.status(200).json(categoryList);
		} catch (err) {
			return res.status(400).json({ err });
		}
	}
}

export default ArtsController;