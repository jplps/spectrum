import express from 'express';
import path from 'path';
import multer from 'multer';
import multerConfig from '../config/multer';

import LabsController from './controllers/LabsController';
import ArtsController from './controllers/ArtsController';

const routes = express.Router();
const upload = multer(multerConfig);

const artsController = new ArtsController();
const labsController = new LabsController();

routes.get('/assets', express.static(path.resolve(__dirname, '..', 'assets')));
routes.get('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

routes.get('/arts', artsController.index);

routes.get('/labs', labsController.index);
routes.post('/labs/:id', labsController.show);
// Implementing image uploading: upload.array('field_name') if multiple items
routes.post('/labs', upload.single('image'), labsController.create);

export default routes;