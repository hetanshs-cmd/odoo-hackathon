import { Router } from 'express';
import { authController } from './auth.controller';
import { requireAuth } from '../../middleware/requireAuth';

const authRouter = Router();

// Registration Flow
authRouter.post('/register', authController.register);
authRouter.post('/register/verify', authController.verifyEmail);

// Login Flow
authRouter.post('/login', authController.login);
authRouter.post('/login/verify', authController.verifyLoginOtp);

// Password Reset Flow
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);

// Session Management
authRouter.post('/logout', requireAuth, authController.logout);

// Protected Profile Route
authRouter.get('/me', requireAuth, authController.me);
authRouter.put('/profile', requireAuth, authController.updateProfile);

export default authRouter;
