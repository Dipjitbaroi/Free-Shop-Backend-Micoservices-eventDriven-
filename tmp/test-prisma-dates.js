// Direct test: does Prisma aggregate return the correct rows for the date range?
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const start = new Date('2026-06-01T00:00:00.000Z');
  const endExclusive = new Date('2026-06-10T00:00:00.000Z');

  // 1. List all rows in the range
  const rows = await prisma.dailySalesReport.findMany({
    where: { date: { gte: start, lt: endExclusive } },
    orderBy: { date: 'asc' },
  });
  console.log('--- ROWS IN RANGE ---');
  console.log('Count:', rows.length);
  for (const r of rows) {
    console.log(`  ${r.date.toISOString().slice(0,10)}  orders=${r.totalOrders} completed=${r.completedOrders} revenue=${r.totalRevenue} newCust=${r.newCustomers}`);
  }

  // 2. Aggregate
  const agg = await prisma.dailySalesReport.aggregate({
    where: { date: { gte: start, lt: endExclusive } },
    _sum: { totalRevenue: true, totalOrders: true, completedOrders: true, newCustomers: true },
  });
  console.log('--- AGGREGATE ---');
  console.log('  totalRevenue=', agg._sum.totalRevenue);
  console.log('  totalOrders=', agg._sum.totalOrders);
  console.log('  completedOrders=', agg._sum.completedOrders);
  console.log('  newCustomers=', agg._sum.newCustomers);

  // 3. Now try with date strings (different Prisma conversion)
  const rows2 = await prisma.dailySalesReport.findMany({
    where: { date: { gte: '2026-06-01', lt: '2026-06-10' } },
    orderBy: { date: 'asc' },
  });
  console.log('--- WITH STRINGS ---');
  console.log('Count:', rows2.length);
  for (const r of rows2) {
    console.log(`  ${r.date.toISOString().slice(0,10)}  orders=${r.totalOrders}`);
  }

  await prisma.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
