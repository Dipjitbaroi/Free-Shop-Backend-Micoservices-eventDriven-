import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient as InventoryClient } from './generated/client/client.js';
import { PrismaClient as ProductClient } from '../product-service/generated/client/client.js';

const inventoryAdapter = new PrismaPg({ connectionString: process.env.INVENTORY_DATABASE_URL });
const inventoryDb = new InventoryClient({ adapter: inventoryAdapter });

const productAdapter = new PrismaPg({ connectionString: process.env.PRODUCT_DATABASE_URL });
const productDb = new ProductClient({ adapter: productAdapter });

const args = new Set(process.argv.slice(2));
const seedMock = args.has('--seed-mock');

async function main() {
  let products = [];
  let freeItems = [];

  if (seedMock) {
    console.log('(--seed-mock) creating 5 mock products directly in the product DB');
    for (let i = 1; i <= 5; i++) {
      const created = await productDb.product.create({
        data: {
          name: `Mock Product ${i}`,
          slug: `mock-product-${i}-${Date.now()}`,
          description: 'auto-seeded test product',
          sku: `MOCK-${i}-${Date.now()}`,
          categoryId: 'mock-category',
          supplierPrice: '5.00',
          price: '10.00',
        },
      });
      products.push(created);
    }
  } else {
    products = await productDb.product.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, sku: true, status: true },
    });
  }

  console.log(`Found ${products.length} products in product DB:`);
  products.forEach((p) => console.log(`  - ${p.id}  ${p.name}  (${p.sku})  status=${p.status}`));

  // List existing inventory rows
  const existing = await inventoryDb.inventory.findMany({
    select: { productId: true, variantId: true, freeItemId: true },
  });
  const existingKeys = new Set(
    existing.map((r) => `${r.productId ?? ''}|${r.variantId ?? ''}|${r.freeItemId ?? ''}`)
  );
  console.log(`\nFound ${existing.length} existing inventory rows.`);

  let created = 0;
  for (const p of products) {
    const key = `${p.id}||`;
    if (existingKeys.has(key)) continue;

    await inventoryDb.inventory.create({
      data: {
        userId: 'seed-script',
        productId: p.id,
        totalStock: 100,
        availableStock: 100,
        reservedStock: 0,
        lowStockThreshold: 5,
        lastRestockAt: new Date(),
        status: 'ACTIVE',
      },
    });
    created++;
    console.log(`  + Created inventory for product ${p.id} (${p.name}) stock=100`);
  }

  // Free items
  try {
    freeItems = await productDb.freeItem.findMany({ take: 50 });
  } catch (e) {
    console.log(`(freeItem model not available in product service: ${e.message.split('\n')[0]})`);
  }
  console.log(`\nFound ${freeItems.length} free items.`);

  for (const f of freeItems) {
    const key = `|${f.id}`;
    if (existingKeys.has(key)) continue;

    await inventoryDb.inventory.create({
      data: {
        userId: 'seed-script',
        freeItemId: f.id,
        totalStock: 100,
        availableStock: 100,
        reservedStock: 0,
        lowStockThreshold: 5,
        lastRestockAt: new Date(),
        status: 'ACTIVE',
      },
    });
    created++;
    console.log(`  + Created inventory for free item ${f.id} stock=100`);
  }

  console.log(`\nDone. Created ${created} new inventory rows.`);
  await inventoryDb.$disconnect();
  await productDb.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
