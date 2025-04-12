import connectionPool from '../utils/db.mjs';

export const checkValueContent = (req, res, next) => {
   const body = req.body;
   // console.log('body: ', body.content);
   const keyAnswer = Object.keys(body);
   // console.log('keyAnswer: ', keyAnswer);
   // เช็ค key เป็น content ไหม
   // เช็ค content มี value
   if (keyAnswer.join() !== 'content' || !body.content) {
      return res.status(400).json({ message: 'Invalid request data.' });
   }
   next();
};

export const checkIdAnswer = async (req, res, next) => {
   const AnswerId = req.params.answerId;
   // console.log('AnswerId: ', AnswerId);
   if (isNaN(AnswerId)) {
      return res.status(400).json({ message: 'Answer ID id on number' });
   }
   const checkID = await connectionPool.query(
      'select * from answer_votes where answer_id = $1 limit 1',
      [AnswerId]
   );
   const countId = checkID.rows.length;
   // console.log('checkID.rows.length: ', countId);

   if (countId === 0) {
      return res.status(404).json({ message: 'Answer not found.' });
   }
   next();
};
