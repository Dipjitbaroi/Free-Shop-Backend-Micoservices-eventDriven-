// @ts-nocheck
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../services/inventory-service/generated/client/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.INVENTORY_DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- INVENTORY DIAGNOSTIC ---');
  console.log('DB:', process.env.INVENTORY_DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));

  const total = await prisma.inventory.count();
  console.log(`Total Inventory rows: ${total}`);

  const sample = await prisma.inventory.findMany({ take: 5 });
  console.log('Sample Inventory rows:');
  sample.forEach((row) => {
    console.log({
      id: row.id,
      productId: row.productId,
      variantId: row.variantId,
      freeItemId: row.freeItemId,
      totalStock: row.totalStock,
      availableStock: row.availableStock,
      reservedStock: row.reservedStock,
    });
  });

  const reservations = await prisma.stockReservation.count();
  console.log(`Total StockReservation rows: ${reservations}`);

  const pendingReservations = await prisma.stockReservation.count({
    where: { status: 'PENDING' },
  });
  console.log(`PENDING reservations: ${pendingReservations}`);

  const fulfilledReservations = await prisma.stockReservation.count({
    where: { status: 'FULFILLED' },
  });
  console.log(`FULFILLED reservations: ${fulfilledReservations}`);

  const movements = await prisma.stockMovement.count();
  console.log(`Total StockMovement rows: ${movements}`);

  const recentMovements = await prisma.stockMovement.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });
  console.log('Recent Stock Movements:');
  recentMovements.forEach((m) => {
    console.log({
      type: m.type,
      qty: m.quantity,
      reason: m.reason,
      reference: m.reference,
      previousStock: m.previousStock,
      newStock: m.newStock,
      at: m.createdAt,
    });
  });

  const distinctProducts = await prisma.inventory.findMany({
    distinct: ['productId'],
    select: { productId: true },
  });
  console.log(`Distinct productIds in Inventory: ${distinctProducts.length}`);

  const simpleRows = await prisma.inventory.count({
    where: { variantId: null, freeItemId: null },
  });
  console.log(`Inventory rows with variantId=NULL AND freeItemId=NULL: ${simpleRows}`);

  const variantRows = await prisma.inventory.count({
    where: { variantId: { not: null } },
  });
  console.log(`Inventory rows with variantId set: ${variantRows}`);

  const freeItemRows = await prisma.inventory.count({
    where: { freeItemId: { not: null } },
  });
  console.log(`Inventory rows with freeItemId set: ${freeItemRows}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
