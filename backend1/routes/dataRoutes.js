import { Router } from 'express';

import { handleInitialization,getMapping } from '../controllers/data.js';

const dataRouter = Router();

dataRouter.post('/initializebot' , handleInitialization)
dataRouter.get('/get-namespace',getMapping)

export default dataRouter;

