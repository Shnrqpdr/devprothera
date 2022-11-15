import express from 'express';
import iconesController from '../controller/iconesController.js';

const iconesRouter = express.Router();

iconesRouter.get('/', async (req, res) => {
    const icones = await iconesController.getIcones();
    res.json({icones, status: 200});
});

export default iconesRouter
