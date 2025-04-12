import connectionPool from '../utils/db.mjs';

export const checkId = async (req, res, next) => {
   const id = req.params.questionId;
   // isNaN หากไม่เป็นตัวเลข
   // parseInt เปลี่ยน "20" = 20
   if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid question ID' });
   }
   console.log('id: ', id);
   const result = await connectionPool.query(
      `select id from questions where id = $1`,
      [id]
   );
   if (result.rows.length === 0) {
      return res.status(404).json({ message: `Question not found.` });
   }
   next();
};

export const checkCreateQuestion = (req, res, next) => {
   const body = req.body;

   console.log('body.description: ', !!body.description);
   console.log('body.tite: ', !!body.title);
   if (!body.title || !body.description) {
      return res.status(404).json({ message: 'Question not found.' });
   }
   next();
};

export const checkInsertKey = async (req, res, next) => {
   const userkey = Object.keys(req.body);
   // console.log('userkey : ', userkey);

   const result = await connectionPool.query(`
      SELECT COLUMN_NAME
      FROM information_schema.columns
      WHERE table_name = 'questions'
      `);
   // console.log('result: ', result.rows);
   //  map chenge to array
   const validKeys = result.rows.map((colomn) => colomn.column_name);
   // console.log('validKeys: ', validKeys);
   // check no same key
   const invalidKeys = userkey.filter((key) => !validKeys.includes(key));
   // console.log('invalidKeys: ', invalidKeys);
   // have invalidKeys status 400
   if (invalidKeys.length > 0) {
      return res.status(400).json({ message: 'Invalid request data.' });
   }
   next();
};
// export const CheckSearchParem = (req, res, next) => {};
