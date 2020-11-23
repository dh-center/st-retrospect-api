import { Router } from 'express';
import axios from 'axios';
import { generateUserToken } from '../../utils/jwt';
import { getCollection } from '../../db';

const router = Router();

router.post('/oauth/facebook/callback', async (req, res) => {
  console.log(req.query);
  try {
    const response = await axios.get(`https://graph.facebook.com/v9.0/me?access_token=${req.query.token}&fields=id,name,first_name,last_name,email,picture.type(large)`);

    const userData = response.data;

    console.log(userData);

    const collection = await getCollection('users');

    const existedUser = await collection.findOne({
      $or: [
        {
          email: req.query.email as string,
        },
        {
          'auth.facebook.id': +userData.id,
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
          facebook: {
            id: +userData.id,
          },
        },
      })).ops[0];

      const accessToken = generateUserToken(newUser);

      return res.json({ data: { accessToken } });
    }

    const accessToken = generateUserToken(existedUser);

    return res.json({ data: { accessToken } });
  } catch (e) {
    console.log(e);
  }

  res.sendStatus(400);
});

export default router;
