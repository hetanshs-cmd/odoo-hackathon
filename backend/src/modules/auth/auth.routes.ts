import { Router } from 'express';
import { authController } from './auth.controller';

const authRouter = Router();

// Registration Flow
authRouter.post('/register', authController.register);
authRouter.post('/register/verify', authController.verifyEmail);

// Login Flow
authRouter.post('/login', authController.login);
// authRouter.post('/login/verify', authController.verifyLoginOtp); // Only if enforcing 2FA

// Password Reset Flow
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);

// Session Management
authRouter.post('/logout', authController.logout);

// Protected Profile Route
// (Needs an auth middleware in the future)
authRouter.get('/me', authController.me);

export default authRouter;
