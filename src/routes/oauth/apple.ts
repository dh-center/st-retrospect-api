import { Router } from 'express';
import jwtHelper from '../../utils/jwt';
import { getCollection } from '../../db';
import * as z from 'zod';
import { WrongAuthData } from '../../errorTypes';
import AppleAuth from 'apple-auth';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { nanoid } from 'nanoid';
import { FilterQuery } from 'mongodb';
import { UserDBScheme } from '../../resolvers/users';

const config = { /* eslint-disable @typescript-eslint/naming-convention */
  client_id: process.env.APPLE_AUTH_CLIENT_ID || '',
  team_id: process.env.APPLE_AUTH_TEAM_ID || '',
  redirect_uri: '', // Leave it blank
  key_id: process.env.APPLE_AUTH_KEY_ID || '',
  scope: 'name email',
};

const appleAuth = new AppleAuth(
  config,
  fs.readFileSync(path.join(__dirname, '../../../', process.env.APPLE_AUTH_KEY_PATH || '')).toString(),
  'text'
);

const router = Router();

/**
 * Schema for the query params for Apple auth handler
 */
const AppleAuthData = z.object({
  code: z.string(),
  givenName: z.string()
    .optional()
    .nullable(),
  middleName: z.string()
    .optional()
    .nullable(),
});

/**
 * User data from Apple API
 */
const AppleUserData = z.object({
  email: z.string().optional(),
  sub: z.string(),
});


router.post('/oauth/apple/callback', async (req, res, next) => {
  let authData;

  try {
    authData = AppleAuthData.parse(req.query);
  } catch (e) {
    return next(new WrongAuthData());
  }

  const accessTokenData = await appleAuth.accessToken(authData.code);

  const appleData = jwt.decode(accessTokenData.id_token);

  let userData;

  try {
    userData = AppleUserData.parse(appleData);
  } catch (e) {
    return next(new WrongAuthData());
  }

  const { sub: appleId, email } = userData;

  const collection = await getCollection('users');

  const query:FilterQuery<UserDBScheme> = {
    $or: [
      {
        'auth.apple.id': appleId,
      },
    ],
  };

  if (email) {
    query.$or?.push({
      email,
    });
  }

  const existedUser = await collection.findOne(query);

  let tokens;

  if (!existedUser) {
    /**
     * Create new user in database
     */
    const newUser = (await collection.insertOne({
      firstName: authData.givenName,
      lastName: authData.middleName,
      email: email,
      username: nanoid(10),
      exp: 0,
      level: 0,
      auth: {
        apple: {
          id: appleId,
        },
      },
    })).ops[0];

    tokens = jwtHelper.generateUserTokens(newUser);
  } else {
    tokens = jwtHelper.generateUserTokens(existedUser);
  }

  return res.json({ data: tokens });
});

export default router;
