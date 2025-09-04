import express from 'express';
import isAuth from '../Middlewares/isAuth.js';
import { AddCatalogController, FetchCatalogController } from '../Controller/CatalogController.js';

const CatalogRouter = express.Router();

CatalogRouter.post('/add', isAuth, AddCatalogController);
CatalogRouter.get('/get', isAuth, FetchCatalogController);

export default CatalogRouter;