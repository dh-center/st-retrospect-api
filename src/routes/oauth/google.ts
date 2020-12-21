/* eslint-disable camelcase */
import { Router } from 'express';
import { google, people_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { getCollection } from '../../db';
import { generateUserToken } from '../../utils/jwt';

const router = Router();

/**
 * Config for Google OAuth2 client
 */
const googleAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirect: process.env.GOOGLE_REDIRECT_URL,
};

/**
 * Creates client for Google OAuth2
 */
function createClient(): OAuth2Client {
  return new google.auth.OAuth2(
    googleAuthConfig.clientId,
    googleAuthConfig.clientSecret,
    googleAuthConfig.redirect
  );
}

/**
 * Returns Google People API instance
 *
 * @param auth - google auth client
 */
function getGooglePeopleApi(auth: OAuth2Client): people_v1.People {
  return google.people({
    version: 'v1',
    auth,
  });
}

/**
 * Fetches Google account info from code for tokens exchanging
 *
 * @param code - code for tokens exchanging
 */
async function getGoogleAccountFromCode(code: string): Promise<people_v1.Schema$Person> {
  const auth = createClient();

  const data = await auth.getToken(code);
  const tokens = data.tokens;

  auth.setCredentials(tokens);
  const peopleApi = getGooglePeopleApi(auth);

  const response = await peopleApi.people.get({
    resourceName: 'people/me',
    personFields: 'names,emailAddresses,photos',
  });

  return response.data;
}

router.post('/oauth/google/callback', async (req, res) => {
  if (!req.query.code) {
    return res.sendStatus(400);
  }

  const userInfo = await getGoogleAccountFromCode(req.query.code as string);

  if (!userInfo || !userInfo.resourceName || !userInfo.names || !userInfo.emailAddresses) {
    return res.sendStatus(500);
  }

  const [, userId] = userInfo.resourceName.split('/');
  const collection = await getCollection('users');

  /**
   * Check is user already signed up
   */
  const existedUser = await collection.findOne({
    'auth.google.id': userId,
  });

  let accessToken;
  const defaultPhoto = userInfo.photos?.find(p => p.metadata?.primary && !p.default)?.url;
  const photo = defaultPhoto ? defaultPhoto + '?sz=1000' : undefined;

  /**
   * Authorize user if already signed up
   */
  if (!existedUser) {
    const name = userInfo.names[0];
    const email = userInfo.emailAddresses[0].value;

    if (!email) {
      return res.sendStatus(500);
    }

    /**
     * Create new user in database
     */
    const newUser = (await collection.insertOne({
      firstName: name.givenName,
      lastName: name.familyName,
      email,
      photo: photo,
      username: email,
      auth: {
        google: {
          id: userId,
        },
      },
    })).ops[0];

    accessToken = generateUserToken(newUser);
  } else {
    accessToken = generateUserToken(existedUser);

    if (!existedUser.photo && photo) {
      await collection.updateOne(
        {
          _id: existedUser._id,
        },
        {
          $set: {
            photo: photo,
          },
        }
      );
    }
  }

  return res.json({ data: { accessToken } });
});

export default router;
