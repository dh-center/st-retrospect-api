import express from 'express';

/**
 * Auth routes
 */
import signUpRoute from './routes/auth/sign-up';
import loginRoute from './routes/auth/login';

const router = express.Router();

router.use(signUpRoute);
router.use(loginRoute);

export default router;
