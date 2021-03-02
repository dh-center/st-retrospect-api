import express from 'express';
import {
  InvalidRefreshToken,
  NoUserWithSuchUsernameError
} from '../../errorTypes';
import getConnection from '../../db';
import { ObjectId } from 'mongodb';
import jwtHelper from '../../utils/jwt';

const router = express.Router();

router.post('/refresh', async (req, res, next) => {
  const db = await getConnection();
  const refreshToken = req.body.refreshToken;

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

  const tokens = jwtHelper.generateUserTokens(user);

  res.json({ data: tokens });
});

export default router;
