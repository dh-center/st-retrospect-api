import express from 'express';
import {
  NoUserWithSuchUsernameError,
  WrongUserPasswordError
} from '../../errorTypes';
import getConnection from '../../db';
import argon2 from 'argon2';
import jwtHelper from '../../utils/jwt';
const router = express.Router();

router.get('/login', async (req, res, next) => {
  const db = await getConnection();
  let user;

  /**
   * First we search user by email, if we haven't email, we search by username
   */
  if (req.query.email) {
    user = await db.collection('users').findOne({ email: req.query.email });
  } else if (req.query.username) {
    user = await db.collection('users').findOne({ username: req.query.username });
  }

  if (!user) {
    return next(new NoUserWithSuchUsernameError());
  }

  const compareResult = await argon2.verify(user.hashedPassword, req.query.password as string);

  if (compareResult) {
    const tokens = jwtHelper.generateUserTokens(user);

    res.json({ data: tokens });
  } else {
    return next(new WrongUserPasswordError());
  }
});

export default router;
