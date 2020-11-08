import express from 'express';
import uploadRoutes from './middlewares/upload';

/**
 * Auth routes
 */
import signUpRoute from './routes/auth/signUp';
import loginRoute from './routes/auth/login';
import googleOauth from './routes/oauth/google';

const router = express.Router();

router.use(signUpRoute);
router.use(loginRoute);
router.use(uploadRoutes);
router.use(googleOauth);

export default router;
