import { Router } from 'express';
import connectionPool from '../utils/db.mjs';
import {
   checkCreateQuestion,
   checkId,
   checkInsertKey,
   checkSearchQuery,
} from '../middlewares/questionVaridate.mjs';
import { checkValueContent } from '../middlewares/answerVaridate.mjs';
import { checkVote } from '../middlewares/voteVaridate.mjs';
const questionsRouter = Router();

questionsRouter.post(`/`, [checkCreateQuestion], async (req, res) => {
   /*  Create a new question
   varidate ให้มีค่าทุก key ไม่มีให้ 400 
   ให้รับ request body เป็น object 
   ให้ try catch หากต่อ database ไม่ได้ res 500
   ให้สั่งสร้าง data โดยเก็บ value ใน $ กับ array
   res 200 log สร้างเสร็จแล้ว
  */
   const body = { ...req.body };
   console.log('body: ', body);
   try {
      await connectionPool.query(
         `insert into questions (title,description,category) values($1,$2,$3)`,
         [body.title, body.description, body.category]
      );
      return res.status(201).json({
         message: 'Question created successfully.',
      });
   } catch (error) {
      return res.status(500).json({ message: 'Unable to create question.' });
   }
});

questionsRouter.get(`/`, async (req, res) => {
   // Get all questions
   try {
      const result = await connectionPool.query(
         `select * from questions limit 3`
      );
      return res.status(200).json({ data: result.rows });
   } catch (error) {
      res.status(500).json({ message: 'Unable to fetch questions.' });
   }
});
questionsRouter.get('/search', [checkSearchQuery], async (req, res) => {
   /* Search questions by title or category
   เช็ตว่า params เป็น title,category
   ถ้าค้นหา parems ไม่เจอ  ให้ status 400 หาไม่กำหนด 
   หากมี param2 ให้หา2 หากมีparam1 ให้หา1 หากไม่มี ให้status 400
   */
   const queryTitle = req.query.title;
   const queryCategory = req.query.category;
   try {
      let result;
      if (queryTitle && queryCategory) {
         result = await connectionPool.query(
            `select * from questions where title like $1 and category like $2`,
            [`%${queryTitle}%`, `%${queryCategory}%`]
         );
      } else if (queryCategory) {
         result = await connectionPool.query(
            `select * from questions where title like $1 OR category like $2 `,
            ['null', `%${queryCategory}%`]
         );
         // console.log('result: ', result);
      } else if (queryTitle) {
         result = await connectionPool.query(
            `select * from questions where title like $1 OR category like $2 `,
            [`%${queryTitle}%`, 'null']
         );
      }
      // console.log('result: ', result);
      return res.status(200).json({ data: result.rows });
   } catch (error) {
      console.log('error: ', error);
      return res.status(500).json({ message: 'Unable to fetch questions.' });
   }
});
questionsRouter.get(`/:questionId`, [checkId], async (req, res) => {
   /* Get all questions
   เช็ค Id ว่ามีไหม
   รับ id จาก req.params
   เช็คเชื่อมต่อ database ได้ไหม try catch log 500
   ดึงข้อมูลจาก database จากId โดยเก็บข้อมูลจาก $
   res ข้อมูลเป็น result.row
   */
   const questionId = req.params.questionId;
   // console.log('questionId: ', questionId);
   try {
      const result = await connectionPool.query(
         `select * from questions where id = $1`,
         [questionId]
      );
      return res.status(200).json({ data: result.rows });
   } catch (error) {
      console.log('error: ', error);
      return res.status(500).json({ message: 'Unable to fetch questions.' });
   }
});
questionsRouter.put(
   `/:questionId`,
   [checkId, checkInsertKey],
   async (req, res) => {
      /* Update a question by ID
   เช็คว่ามี id ไหม 404
   เช็คว่ามี key ไหม 400
   try catch ว่า เชื่อม datadas ได้ไหม 500
   ใช้ update ในการเปลี่ยนแปลง โดยยึดด้วย id
   success 200
   */
      const data = req.body;
      const userId = req.params.questionId;
      try {
         await connectionPool.query(
            `update questions set title=$2,description=$3,category=$4 where id = $1`,
            [userId, data.title, data.description, data.category]
         );
         return res
            .status(200)
            .json({ message: 'Question updated successfully' });
      } catch (error) {
         console.log('error: ', error);
         return res.status(500).json({ message: 'Unable to fetch questions.' });
      }
   }
);
questionsRouter.delete(`/:questionId`, [checkId], async (req, res) => {
   //  Delete a question by ID
   const userId = req.params.questionId;
   try {
      await connectionPool.query(`DELETE FROM questions where id = $1`, [
         userId,
      ]);
      return res
         .status(200)
         .json({ message: 'Question post has been deleted successfully.' });
   } catch (error) {
      console.log('error: ', error);
      return res.status(500).json({ message: 'Unable to delete questions.' });
   }
});

questionsRouter.post(
   `/:questionId/answers`,
   [checkId, checkValueContent],
   async (req, res) => {
      const id = req.params.questionId;
      const body = req.body.content;
      // Create an answer for a question
      // เช็ค id
      // try catch
      // เช็คว่าได้ใส่ answer ไหม
      // inser into answers
      // success 200
      try {
         await connectionPool.query(
            `insert into answers (question_id,content) values($1,$2)`,
            [id, body]
         );
         return res
            .status(200)
            .json({ message: 'Answer created successfully.' });
      } catch (error) {
         console.log('error: ', error);
         return res
            .status(500)
            .json({ message: 'Unable to delete questions.' });
      }
   }
);
questionsRouter.get(`/:questionId/answers`, [checkId], async (req, res) => {
   const id = req.params.questionId;

   try {
      const result = await connectionPool.query(
         `
         select questions.id,answers.content from answers 
         inner join questions on questions.id=answers.question_id
         where questions.id=$1
         `,
         [id]
      );
      return res.status(200).json({ data: result.rows });
   } catch (error) {
      console.log('error: ', error);
      return res.status(500).json({ message: 'Unable to delete questions.' });
   }
});
questionsRouter.delete(`/:questionId/answers`, [checkId], async (req, res) => {
   const userId = req.params.questionId;
   try {
      await connectionPool.query(
         `DELETE FROM answers 
         where question_id = $1`,
         [userId]
      );
      return res.status(200).json({
         message:
            'All answers for the question have been deleted successfully.',
      });
   } catch (error) {
      console.log('error: ', error);
      return res.status(500).json({ message: 'Unable to delete answers.' });
   }
});
questionsRouter.post(
   `/:questionId/vote`,
   [checkId, checkVote],
   async (req, res) => {
      // check id
      // varidate vote 1 or -1
      // udate vote
      const userId = req.params.questionId;
      const vote = req.body.vote;
      try {
         await connectionPool.query(
            `UPDATE question_votes
         SET vote = $2
         WHERE question_id = $1`,
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

export default questionsRouter;
