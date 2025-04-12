export const checkVote = (req, res, next) => {
   const vote = req.body.vote;
   // console.log('vote: ', vote);
   // console.log('type: ', typeof vote);
   // console.log('type: ', vote !== -1);
   if (vote !== 1 && vote !== -1) {
      console.log('false number');
      return res.status(400).json({ message: 'Invalid vote value.' });
   }
   next();
};
