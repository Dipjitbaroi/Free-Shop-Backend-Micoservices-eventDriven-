import { PrismaClient } from '../generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load service .env using process.cwd() to avoid generated client overriding __dirname
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });
console.log('.env path used:', envPath, 'exists=', fs.existsSync(envPath));

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.ORDER_DATABASE_URL });
  console.log('ORDER_DATABASE_URL=', process.env.ORDER_DATABASE_URL?.slice(0, 80));
  const prisma = new PrismaClient({ adapter });

  const setting = await prisma.setting.findUnique({ where: { key: 'deliveryCharges' } });
  if (!setting) {
    console.log('No deliveryCharges setting found. Nothing to migrate.');
    await prisma.$disconnect();
    return;
  }

  const charges = setting.value as Record<string, number>;
  if (!charges || Object.keys(charges).length === 0) {
    console.log('deliveryCharges setting is empty. Nothing to migrate.');
    await prisma.$disconnect();
    return;
  }

  const mapping: Record<string, string> = {};

  for (const [key, price] of Object.entries(charges)) {
    // Create a Zone for each legacy key. Use the legacy key as the human-readable name.
    const z = await prisma.zone.create({ data: { name: key, price: Number(price) } });
    mapping[key] = z.id;
    console.log(`Created Zone: ${key} -> ${z.id} (price=${price})`);
  }

  const outDir = path.join(__dirname, '..', 'prisma', 'migrations');
  try {
    fs.mkdirSync(outDir, { recursive: true });
  } catch (e) {
    // ignore
  }

  const outFile = path.join(outDir, 'deliveryCharges_to_zones.json');
  fs.writeFileSync(outFile, JSON.stringify(mapping, null, 2), 'utf8');
  console.log(`Wrote mapping to ${outFile}`);

  // Print SQL statements to update user-service addresses.
  console.log('\n-- SQL statements to update user-service Address.zoneId values (run against user-service DB) --');
  for (const [legacy, id] of Object.entries(mapping)) {
    console.log(`UPDATE \"Address\" SET \"zoneId\" = '${id}' WHERE \"zoneId\" = '${legacy}';`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
