import express from 'express';
import { UsernameDuplicationError } from '../../errorTypes';
import getConnection from '../../db';
import argon2 from 'argon2';
const router = express.Router();

router.post('/sign-up', async (req, res, next) => {
  try {
    const db = await getConnection();
    const hashedPassword = await argon2.hash(req.body.password);

    await db.collection('users').insertOne({ username: req.body.username, hashedPassword });

    res.sendStatus(201);
  } catch (error) {
    // Catch MongoDB duplication error
    if (error.name === 'MongoError' && error.code === 11000) {
      return next(new UsernameDuplicationError());
    }
    return next(error);
  }
});

export default router;
