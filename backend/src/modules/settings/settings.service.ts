import { PrismaClient } from '@prisma/client';
import { UpdateSettingsDto } from './settings.validator';

const prisma = new PrismaClient();

export class SettingsService {
  async getSettings() {
    let settings = await prisma.organizationSettings.findFirst();
    if (!settings) {
      settings = await prisma.organizationSettings.create({
        data: {
          organizationName: 'TransitOps Default Org',
        },
      });
    }
    return settings;
  }

  async updateSettings(data: UpdateSettingsDto) {
    const settings = await this.getSettings();
    return prisma.organizationSettings.update({
      where: { id: settings.id },
      data,
    });
  }
}

export const settingsService = new SettingsService();
