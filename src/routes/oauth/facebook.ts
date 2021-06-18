import { Router } from 'express';
import axios from 'axios';
import jwtHelper from '../../utils/jwt';
import { getCollection } from '../../db';
import * as z from 'zod';
import { WrongAuthData } from '../../errorTypes';

const router = Router();

/**
 * Schema for the query params for Facebook auth handler
 */
const FacebookAuthDataScheme = z.object({
  token: z.string(),
});

/**
 * Schema for the Facebook user data
 */
const FacebookUserData = z.object({ /* eslint-disable @typescript-eslint/naming-convention */
  id: z.string(),
  name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  picture: z.object({
    data: z.object({
      url: z.string(),
      is_silhouette: z.boolean(),
    }),
  }),
});

router.post('/oauth/facebook/callback', async (req, res, next) => {
  let authData;

  try {
    authData = FacebookAuthDataScheme.parse(req.query);
  } catch (e) {
    return next(new WrongAuthData());
  }

  const response = await axios.get(`https://graph.facebook.com/v9.0/me?access_token=${authData.token}&fields=id,name,first_name,last_name,email,picture.type(large)`);
  let userData;

  try {
    userData = FacebookUserData.parse(response.data);
  } catch {
    return next(new WrongAuthData());
  }

  const collection = await getCollection('users');

  const existedUser = await collection.findOne({
    $or: [
      {
        email: userData.email,
      },
      {
        'auth.facebook.id': +userData.id,
      },
    ],
  });

  let data;
  const photo = !userData.picture.data.is_silhouette ? userData.picture.data.url : null;

  if (!existedUser) {
    /**
     * Create new user in database
     */
    const newUser = (await collection.insertOne({
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: userData.email,
      username: userData.email,
      photo,
      exp: 0,
      level: 0,
      auth: {
        facebook: {
          id: +userData.id,
        },
      },
    })).ops[0];

    const tokens = jwtHelper.generateUserTokens(newUser);

    data = {
      ...tokens,
      isFirstRegistration: true,
    };
  } else {
    const tokens = jwtHelper.generateUserTokens(existedUser);

    data = {
      ...tokens,
      isFirstRegistration: false,
    };

    if (!existedUser.photo && photo) {
      await collection.updateOne(
        {
          _id: existedUser._id,
        },
        {
          $set: {
            photo: userData.picture.data.url,
          },
        }
      );
    }
  }

  return res.json({ data });
});

export default router;
