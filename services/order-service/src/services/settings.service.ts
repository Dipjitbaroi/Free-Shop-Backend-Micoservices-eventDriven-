import { prisma } from '../lib/prisma.js';

export class SettingsService {

  async get(key: string): Promise<any | null> {
    const setting = await prisma.setting.findUnique({ where: { key } });
    if (!setting) return null;
    try {
      return typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
    } catch {
      return setting.value;
    }
  }


  async set(key: string, value: any, updatedBy: string): Promise<void> {
    const val = typeof value === 'string' ? value : JSON.stringify(value);
    await prisma.setting.upsert({
      where: { key },
      update: { value: val, updatedBy, updatedAt: new Date() },
      create: { key, value: val, updatedBy },
    });
  }

  async getAll(): Promise<Record<string, any>> {
    const settings = await prisma.setting.findMany();
    const result: Record<string, any> = {};
    for (const s of settings) {
      try {
        result[s.key] = typeof s.value === 'string' ? JSON.parse(s.value) : s.value;
      } catch {
        result[s.key] = s.value;
      }
    }
    return result;
  }
}

export const settingsService = new SettingsService();
