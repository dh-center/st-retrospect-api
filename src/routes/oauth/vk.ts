import { Router } from 'express';
import { API } from 'vk-io';
import { getCollection } from '../../db';
import jwtHelper from '../../utils/jwt';
import * as z from 'zod';
import { nanoid } from 'nanoid';
import { WrongAuthData } from '../../errorTypes';

/**
 * VK API instance
 */
const api = new API({
  token: process.env.VK_API_TOKEN as string,
});

/**
 * Util for validating callback input for authorization via VK
 */
const VkAuthDataScheme = z
  .object({
    accessToken: z.string(),
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    photo: z
      .string()
      .optional()
      .nullable(),
  });

const router = Router();

router.post('/oauth/vk/callback', async (req, res, next) => {
  let authData;

  try {
    authData = VkAuthDataScheme.parse(req.query);
  } catch (e) {
    return next(new WrongAuthData());
  }

  const tokenCheckResult = await api.secure.checkToken({ token: authData.accessToken });

  if (+authData.userId !== tokenCheckResult.user_id) {
    return next(new WrongAuthData());
  }

  const collection = await getCollection('users');

  const existedUser = await collection.findOne({
    $or: [
      {
        'auth.vk.id': +authData.userId,
      },
    ],
  });

  let accessToken;

  if (!existedUser) {
    /**
     * Create new user in database
     */
    const newUser = (await collection.insertOne({
      firstName: authData.firstName,
      lastName: authData.lastName,
      username: nanoid(10),
      photo: authData.photo || null,
      exp: 0,
      level: 0,
      auth: {
        vk: {
          id: tokenCheckResult.user_id,
        },
      },
    })).ops[0];

    accessToken = jwtHelper.generateUserTokens(newUser);
  } else {
    accessToken = jwtHelper.generateUserTokens(existedUser);

    if (!existedUser.photo && authData.photo) {
      await collection.updateOne(
        {
          _id: existedUser._id,
        },
        {
          $set: {
            photo: authData.photo,
          },
        }
      );
    }
  }

  return res.json({ data: { accessToken } });
});

export default router;
