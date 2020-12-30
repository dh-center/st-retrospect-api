import express from 'express';
import { UsernameDuplicationError, WrongAuthData } from '../../errorTypes';
import getConnection from '../../db';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';
const router = express.Router();

router.post('/sign-up', async (req, res, next) => {
  try {
    const db = await getConnection();
    const hashedPassword = await argon2.hash(req.body.password);

    /**
     * Sign up user with email
     */
    if (req.body.email) {
      if (!/\S+@\S+\.\S+/.test(req.body.email)) {
        throw new WrongAuthData();
      }

      await db.collection('users').insertOne({
        email: req.body.email,
        username: nanoid(10),
        hashedPassword,
      });
    } else {
      await db.collection('users').insertOne({
        username: req.body.username,
        hashedPassword,
      });
    }

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
