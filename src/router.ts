import express from 'express';

/**
 * Auth routes
 */
import signUpRoute from './routes/auth/signUp';
import loginRoute from './routes/auth/login';

const router = express.Router();

router.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

router.use(signUpRoute);
router.use(loginRoute);

export default router;
