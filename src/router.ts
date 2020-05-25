import express from 'express';
import uploadRoutes from './middlewares/upload';

/**
 * Auth routes
 */
import signUpRoute from './routes/auth/signUp';
import loginRoute from './routes/auth/login';

const router = express.Router();

router.use(signUpRoute);
router.use(loginRoute);
router.use(uploadRoutes);

export default router;
