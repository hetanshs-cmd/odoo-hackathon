import { prisma } from '../../config/db';
import { RegisterDto } from './auth.validator';
import { User, OtpVerification } from '@prisma/client';

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async createUser(data: RegisterDto, passwordHash: string): Promise<User> {
    // Note: In a real app, roleId might be assigned differently.
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        isActive: true, // Default to true so they can login after OTP verification
        emailVerified: false,
      },
    });
  }

  async verifyUserEmail(userId: number): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }

  async updatePassword(userId: number, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async createOtp(
    userId: number,
    otpHash: string,
    purpose: string,
    expiresAt: Date,
  ): Promise<OtpVerification> {
    return prisma.otpVerification.create({
      data: {
        userId,
        otpHash,
        purpose,
        expiresAt,
      },
    });
  }

  async getValidOtp(userId: number, purpose: string): Promise<OtpVerification | null> {
    return prisma.otpVerification.findFirst({
      where: {
        userId,
        purpose,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markOtpAsUsed(otpId: number): Promise<OtpVerification> {
    return prisma.otpVerification.update({
      where: { id: otpId },
      data: { isUsed: true },
    });
  }

  async incrementOtpAttempts(otpId: number, currentAttempts: number): Promise<OtpVerification> {
    return prisma.otpVerification.update({
      where: { id: otpId },
      data: { attempts: currentAttempts + 1 },
    });
  }

  async clearUserOtps(userId: number, purpose: string): Promise<void> {
    await prisma.otpVerification.deleteMany({
      where: {
        userId,
        purpose,
      },
    });
  }
}

export const authRepository = new AuthRepository();
