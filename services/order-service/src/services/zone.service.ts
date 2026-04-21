import { prisma } from '../lib/prisma.js';

class ZoneService {
  async getAll(): Promise<Array<{ id: string; name: string; price: number }>> {
    return (prisma as any).zone.findMany({ select: { id: true, name: true, price: true } });
  }

  async get(id: string): Promise<{ id: string; name: string; price: number } | null> {
    return (prisma as any).zone.findUnique({ where: { id }, select: { id: true, name: true, price: true } });
  }

  async upsertMany(zones: Array<{ id?: string; name: string; price: number }>) {
    // Upsert each zone sequentially (small admin operation)
    for (const z of zones) {
      if (z.id) {
        await (prisma as any).zone.upsert({
          where: { id: z.id },
          create: { id: z.id, name: z.name, price: z.price },
          update: { name: z.name, price: z.price },
        });
      } else {
        await (prisma as any).zone.create({ data: { name: z.name, price: z.price } });
      }
    }
  }

  async delete(id: string) {
    await (prisma as any).zone.delete({ where: { id } });
  }
}

export const zoneService = new ZoneService();
