import { Router } from 'express';
const questionsRouter = Router();
import connectionPool from '../utils/db.mjs';

questionsRouter.get(`/`, async (req, res) => {
   try {
      const result = await connectionPool.query(`select * from questions`);
      return res.status(200).json({ data: result.rows });
   } catch (error) {
      res.status(500).json({ message: 'Unable to fetch questions.' });
   }
});

export default questionsRouter;
