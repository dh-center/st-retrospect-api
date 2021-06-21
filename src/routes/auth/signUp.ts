import express from 'express';
import { UsernameDuplicationError } from '../../errorTypes';
import { getCollection } from '../../db';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import { z } from 'zod';
const router = express.Router();

const passwordScheme = z.string().min(5);

export const usernameScheme = z.string().min(4);

/**
 * Input to sign up via email
 */
const SignUpWithEmailInputScheme = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: passwordScheme,
});

/**
 * Input for sign up via username
 */
const SignUpWithUsernameInputScheme = z.object({
  username: usernameScheme,
  password: passwordScheme,
});

const SignUpInputScheme = z.union([SignUpWithEmailInputScheme, SignUpWithUsernameInputScheme]);

router.post('/sign-up', async (req, res, next) => {
  try {
    const usersCollection = await getCollection('users');

    const signUpInput = SignUpInputScheme.parse(req.body);

    const hashedPassword = await argon2.hash(signUpInput.password);

    /**
     * Sign up user with email
     */
    if ('email' in signUpInput) {
      const [firstName, lastName] = signUpInput.name.split(' ');

      await usersCollection.insertOne({
        exp: 0,
        level: 0,
        email: signUpInput.email,
        lastName,
        firstName,
        username: nanoid(10),
        hashedPassword,
      });
    } else {
      await usersCollection.insertOne({
        exp: 0,
        level: 0,
        username: signUpInput.username,
        hashedPassword,
      });
    }

    res.sendStatus(201);
  } catch (error) {
    // Catch MongoDB duplication error
    if (error.name === 'MongoError' && error.code === 11000) {
      return next(new UsernameDuplicationError());
    }

    return next(error);
  }
});

export default router;
