import { Router } from 'express';
import { recommendationController } from '../controllers/recommendationController.js';
import { prisma } from '../database.js';

const env = process.env.START_MODE;
const recommendationRouter = Router();

recommendationRouter.post('/', recommendationController.insert);
recommendationRouter.get('/', recommendationController.get);
recommendationRouter.get('/random', recommendationController.random);
recommendationRouter.get('/top/:amount', recommendationController.getTop);
recommendationRouter.get('/:id', recommendationController.getById);
recommendationRouter.post('/:id/upvote', recommendationController.upvote);
recommendationRouter.post('/:id/downvote', recommendationController.downvote);

if (env === 'test') {
  recommendationRouter.delete('/', async (req, res) => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
    return res.sendStatus(200);
  });
}

export default recommendationRouter;
