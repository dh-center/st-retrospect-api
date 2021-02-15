import express from 'express';
import {
  InvalidRefreshToken,
  NoUserWithSuchUsernameError,
  WrongUserPasswordError
} from '../../errorTypes';
import getConnection from '../../db';
import argon2 from 'argon2';
const router = express.Router();

import { ObjectId } from 'mongodb';
import jwtHelper from '../../utils/jwt';


router.post('/refresh', async (req, res, next) => {
  const db = await getConnection();
  const refreshToken = req.body;

  if (!refreshToken) {
    return next(new NoUserWithSuchUsernameError());
  }

  let userId;

  try {
    const data = await jwtHelper.verifyRefreshToken(refreshToken);

    userId = data.userId;
  } catch (err) {
    return next(new InvalidRefreshToken());
  }

  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

  if (!user) {
    return next(new InvalidRefreshToken());
  }

  const compareResult = await argon2.verify(user.hashedPassword, req.query.password as string);

  if (compareResult) {
    const accessToken = jwtHelper.generateUserTokens(user);

    res.json({ data: { accessToken } });
  } else {
    return next(new WrongUserPasswordError());
  }
});

export default router;
