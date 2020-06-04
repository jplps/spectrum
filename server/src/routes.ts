import express from 'express';

import LabsController from './controllers/LabsController';
import ArtsController from './controllers/ArtsController';

const routes = express.Router();

const labsController = new LabsController();
routes.get('/labs', labsController.index);
routes.post('/labs/:id', labsController.show);
routes.post('/labs', labsController.create);

const artsController = new ArtsController();
routes.get('/arts', artsController.index);

export default routes;