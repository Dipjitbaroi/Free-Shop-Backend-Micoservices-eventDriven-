const path = require('path');
const fs = require('fs');
const root = 'd:/GitHub/Free-Shop-Backend-Micoservices(eventDriven)';
const dirs = [
  'services/product-service/src/config',
  'services/inventory-service/src/config',
  'services/order-service/src/config',
  'services/analytics-service/src/config',
  'services/notification-service/src/config',
  'services/vendor-service/src/config',
  'services/user-service/src/config',
  'services/auth-service/src/config',
  'services/payment-service/src/config',
  'services/api-gateway/src/config',
];
for (const d of dirs) {
  const r3 = path.resolve(root, d, '../../../.env');
  const r4 = path.resolve(root, d, '../../../../.env');
  console.log(d.padEnd(45), '3-up:', fs.existsSync(r3) ? 'OK' : 'NO', '| 4-up:', fs.existsSync(r4) ? 'OK' : 'NO');
}
