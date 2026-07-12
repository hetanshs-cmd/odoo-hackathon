import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/AppError';
import { authRepository } from './auth.repository';
import { env } from '../../config/env';
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ResetPasswordDto,
  ForgotPasswordDto,
} from './auth.validator';
import { User } from '@prisma/client';
import { emailService } from '../../services/email.service';

export class AuthService {
  private readonly JWT_SECRET = env.JWT_ACCESS_SECRET || 'fallback-secret-for-dev-only-change-me';
  private readonly JWT_EXPIRES_IN = '1d';
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly MAX_OTP_ATTEMPTS = 5;

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: (user as User & { role?: { name: string } }).role?.name,
      },
      this.JWT_SECRET,
      {
        expiresIn: this.JWT_EXPIRES_IN,
      },
    );
  }

  async register(data: RegisterDto) {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new AppError('EMAIL_ALREADY_EXISTS', 409, 'A user with this email already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await authRepository.createUser(data, passwordHash);

    // Generate Verification OTP
    const rawOtp = this.generateOtp();
    const otpHash = await bcrypt.hash(rawOtp, 10);
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60000);

    await authRepository.createOtp(user.id, otpHash, 'VERIFY_EMAIL', expiresAt);

    // Send OTP via Email
    await emailService.sendOtpEmail(data.email, data.name, rawOtp, 'registration');

    return { tempId: user.id.toString() };
  }

  async verifyEmail(data: VerifyOtpDto) {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError('NOT_FOUND', 404, 'User not found.');
    }

    if (user.emailVerified) {
      throw new AppError('CONFLICT', 400, 'Email is already verified.');
    }

    const otpRecord = await authRepository.getValidOtp(user.id, 'VERIFY_EMAIL');
    if (!otpRecord) {
      throw new AppError('VALIDATION_ERROR', 400, 'OTP is invalid or has expired.');
    }

    if (otpRecord.attempts >= this.MAX_OTP_ATTEMPTS) {
      throw new AppError('FORBIDDEN', 400, 'Too many failed attempts. Please request a new OTP.');
    }

    const isValid = await bcrypt.compare(data.otp, otpRecord.otpHash);
    if (!isValid) {
      await authRepository.incrementOtpAttempts(otpRecord.id, otpRecord.attempts);
      throw new AppError('VALIDATION_ERROR', 400, 'Invalid OTP code.');
    }

    await authRepository.markOtpAsUsed(otpRecord.id);
    await authRepository.verifyUserEmail(user.id);

    return null;
  }

  async login(data: LoginDto) {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      throw new AppError('FORBIDDEN', 403, 'Account is inactive. Please contact support.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('INVALID_CREDENTIALS', 401, 'Invalid email or password.');
    }

    if (!user.emailVerified) {
      throw new AppError('FORBIDDEN', 403, 'Please verify your email before logging in.');
    }

    // Clear any existing login OTPs for this user
    await authRepository.clearUserOtps(user.id, 'LOGIN');

    // Generate and send login OTP
    const rawOtp = this.generateOtp();
    const otpHash = await bcrypt.hash(rawOtp, 10);
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60000);

    await authRepository.createOtp(user.id, otpHash, 'LOGIN', expiresAt);

    // Send OTP via Email
    await emailService.sendOtpEmail(data.email, user.name, rawOtp, 'login');

    return {
      requireOtp: true,
    };
  }

  async verifyLoginOtp(data: VerifyOtpDto) {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError('VALIDATION_ERROR', 400, 'Invalid or expired OTP.');
    }

    const otpRecord = await authRepository.getValidOtp(user.id, 'LOGIN');
    if (!otpRecord) {
      throw new AppError('VALIDATION_ERROR', 400, 'OTP is invalid or has expired.');
    }

    if (otpRecord.attempts >= this.MAX_OTP_ATTEMPTS) {
      throw new AppError('FORBIDDEN', 400, 'Too many failed attempts. Please login again.');
    }

    const isValid = await bcrypt.compare(data.otp, otpRecord.otpHash);
    if (!isValid) {
      await authRepository.incrementOtpAttempts(otpRecord.id, otpRecord.attempts);
      throw new AppError('VALIDATION_ERROR', 400, 'Invalid OTP code.');
    }

    await authRepository.markOtpAsUsed(otpRecord.id);

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: (user as User & { role?: { name: string } }).role?.name,
      },
    };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      // Security best practice: don't reveal if user exists
      return null;
    }

    await authRepository.clearUserOtps(user.id, 'RESET_PASSWORD');

    const rawOtp = this.generateOtp();
    const otpHash = await bcrypt.hash(rawOtp, 10);
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60000);

    await authRepository.createOtp(user.id, otpHash, 'RESET_PASSWORD', expiresAt);

    // Send Password Reset OTP
    await emailService.sendOtpEmail(user.email, user.name, rawOtp, 'password_reset');
    return null;
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError('VALIDATION_ERROR', 400, 'Invalid or expired OTP.');
    }

    const otpRecord = await authRepository.getValidOtp(user.id, 'RESET_PASSWORD');
    if (!otpRecord) {
      throw new AppError('VALIDATION_ERROR', 400, 'Invalid or expired OTP.');
    }

    if (otpRecord.attempts >= this.MAX_OTP_ATTEMPTS) {
      throw new AppError('FORBIDDEN', 400, 'Too many failed attempts. Please request a new OTP.');
    }

    const isValid = await bcrypt.compare(data.otp, otpRecord.otpHash);
    if (!isValid) {
      await authRepository.incrementOtpAttempts(otpRecord.id, otpRecord.attempts);
      throw new AppError('VALIDATION_ERROR', 400, 'Invalid OTP code.');
    }

    const salt = await bcrypt.genSalt(12);
    const newPasswordHash = await bcrypt.hash(data.newPassword, salt);

    await authRepository.updatePassword(user.id, newPasswordHash);
    await authRepository.markOtpAsUsed(otpRecord.id);

    return null;
  }
}

export const authService = new AuthService();
