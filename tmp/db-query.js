// Run SQL queries through docker exec using heredoc
const { execSync } = require('child_process');
const fs = require('fs');

function psql(db, sqlFile) {
  return execSync(
    `docker exec -i freeshop-postgres-dev psql -U freeshop_user -d ${db} < "${sqlFile}"`,
    { encoding: 'utf8' }
  );
}

// Write SQL files
fs.writeFileSync('tmp/q1.sql', `SELECT date, "totalOrders", "completedOrders", "totalRevenue", "newCustomers" FROM "DailySalesReport" ORDER BY date DESC LIMIT 20;`);
fs.writeFileSync('tmp/q2.sql', `SELECT COALESCE(SUM("totalOrders"),0) AS orders, COALESCE(SUM("completedOrders"),0) AS completed, COALESCE(SUM("totalRevenue"),0) AS revenue, COALESCE(SUM("newCustomers"),0) AS newcust FROM "DailySalesReport" WHERE date >= '2026-06-01' AND date < '2026-06-10';`);
fs.writeFileSync('tmp/q3.sql', `SELECT COALESCE(SUM("totalOrders"),0) AS orders, COALESCE(SUM("completedOrders"),0) AS completed, COALESCE(SUM("totalRevenue"),0) AS revenue FROM "DailySalesReport" WHERE date >= '2026-05-23' AND date < '2026-06-01';`);

console.log('=== DailySalesReport state ===');
console.log(psql('freeshop_analytics', 'tmp/q1.sql'));

console.log('\n=== Current period (2026-06-01..2026-06-10) sum ===');
console.log(psql('freeshop_analytics', 'tmp/q2.sql'));

console.log('\n=== Previous period (2026-05-23..2026-05-31) sum ===');
console.log(psql('freeshop_analytics', 'tmp/q3.sql'));
