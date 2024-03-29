import express from 'express';
import uploadRoutes from './middlewares/upload';

/**
 * Auth routes
 */
import signUpRoute from './routes/auth/signUp';
import loginRoute from './routes/auth/login';
import refreshRoute from './routes/auth/refresh';

import googleOauth from './routes/oauth/google';
import vkOauth from './routes/oauth/vk';
import facebookOauth from './routes/oauth/facebook';
import appleOauth from './routes/oauth/apple';

const router = express.Router();

router.use(signUpRoute);
router.use(loginRoute);
router.use(refreshRoute);
router.use(uploadRoutes);
router.use(googleOauth);
router.use(vkOauth);
router.use(facebookOauth);
router.use(appleOauth);

export default router;
