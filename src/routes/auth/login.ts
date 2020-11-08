import express from 'express';
import {
  NoUserWithSuchUsernameError,
  WrongUserPasswordError
} from '../../errorTypes';
import getConnection from '../../db';
import argon2 from 'argon2';
import { generateUserToken } from '../../utils/jwt';
const router = express.Router();

router.get('/login', async (req, res, next) => {
  const db = await getConnection();
  const user = await db.collection('users').findOne({ username: req.query.username });

  if (!user) {
    return next(new NoUserWithSuchUsernameError());
  }

  const compareResult = await argon2.verify(user.hashedPassword, req.query.password as string);

  if (compareResult) {
    const accessToken = generateUserToken(user);

    res.json({ data: { accessToken } });
  } else {
    return next(new WrongUserPasswordError());
  }
});

export default router;
