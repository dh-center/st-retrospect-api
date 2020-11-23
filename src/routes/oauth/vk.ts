import { Router } from 'express';
import { API } from 'vk-io';
import { getCollection } from '../../db';
import { generateUserToken } from '../../utils/jwt';

const api = new API({
  token: process.env.VK_API_TOKEN as string,
});

const router = Router();

router.post('/oauth/vk/callback', async (req, res) => {
  // @todo create JSON Schema for fields validation
  if (!req.query.access_token || !req.query.user_id || !req.query.email) {
    return res.sendStatus(400);
  }

  const users = await api.secure.checkToken({ token: req.query.access_token as string });

  if (+req.query.user_id !== users.user_id) {
    return res.sendStatus(400);
  }

  const collection = await getCollection('users');

  const existedUser = await collection.findOne({
    $or: [
      {
        email: req.query.email as string,
      },
      {
        'auth.vk.id': +req.query.user_id as number,
      },
    ],
  });

  if (!existedUser) {
    /**
     * Create new user in database
     */
    const newUser = (await collection.insertOne({
      firstName: req.query.first_name as string,
      lastName: req.query.last_name as string,
      email: req.query.email as string,
      username: req.query.email as string, // @todo think about username uniques
      auth: {
        vk: {
          id: users.user_id,
        },
      },
    })).ops[0];

    const accessToken = generateUserToken(newUser);

    return res.json({ data: { accessToken } });
  }

  // @todo think about this closure
  if (existedUser.email === req.query.email && existedUser.auth?.vk?.id === users.user_id) {
    const accessToken = generateUserToken(existedUser);

    return res.json({ data: { accessToken } });
  }
  res.sendStatus(400);
});

export default router;
