import { Router } from 'express';
import connectionPool from '../utils/db.mjs';
import { checkVote } from '../middlewares/voteVaridate.mjs';
import { checkIdAnswer } from '../middlewares/answerVaridate.mjs';

const answersRouter = Router();

export default answersRouter;

answersRouter.post(
   `/:answerId/vote`,
   [checkIdAnswer, checkVote],
   async (req, res) => {
      // check id
      // varidate vote 1 or -1
      // udate vote
      const userId = req.params.answerId;
      const vote = req.body.vote;
      try {
         await connectionPool.query(
            `UPDATE answer_votes
         SET vote = $2
         WHERE answer_id = $1`,
            [userId, vote]
         );
         return res.status(200).json({
            message: 'Vote on the question has been recorded successfully.',
         });
      } catch (error) {
         console.log('error: ', error);
         return res.status(500).json({ message: 'Unable to vote question.' });
      }
   }
);
