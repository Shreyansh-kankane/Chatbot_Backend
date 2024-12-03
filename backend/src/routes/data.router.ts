import { Router } from 'express';
const {handleInitialization} = require('../controllers/data.controller.js')

const dataRouter = Router();

dataRouter.post('/initializebot' , handleInitialization)

export default dataRouter;
