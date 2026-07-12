import { Request, Response } from 'express';
import { authService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendOk, sendCreated } from '../../utils/apiResponse';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validator';
import { AppError } from '../../utils/AppError';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    sendCreated(res, result, 'Registration successful. Please check your email for the OTP.');
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = verifyOtpSchema.parse(req.body);
    await authService.verifyEmail(validatedData);
    sendOk(
      res,
      null,
      'Email verified successfully. Your account is pending admin approval if required, otherwise you may login.',
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    sendOk(res, result, 'Login successful');
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = forgotPasswordSchema.parse(req.body);
    await authService.forgotPassword(validatedData);
    sendOk(res, null, 'If that email is registered, a reset code has been sent.');
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(validatedData);
    sendOk(res, null, 'Password has been reset successfully. You may now login.');
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await Promise.resolve();
    sendOk(res, null, 'Logged out successfully');
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    await Promise.resolve();
    const user = req.user;
    if (!user) {
      throw new AppError('NOT_AUTHENTICATED', 401, 'Not authenticated');
    }
    sendOk(res, user, 'User profile retrieved');
  });
}

export const authController = new AuthController();
