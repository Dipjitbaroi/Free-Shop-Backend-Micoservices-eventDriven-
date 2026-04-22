import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.AUTH_DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Permission code constants (must match PERMISSION_CODES in shared-types)
const PERMISSION_CODES = {
  // User permissions
  USER_CREATE: 1001,
  USER_READ: 1002,
  USER_UPDATE: 1003,
  USER_DELETE: 1004,
  USER_APPROVE: 1005,
  USER_REJECT: 1006,

  // Role permissions
  ROLE_CREATE: 2001,
  ROLE_READ: 2002,
  ROLE_UPDATE: 2003,
  ROLE_DELETE: 2004,

  // Permission management
  PERMISSION_CREATE: 3001,
  PERMISSION_READ: 3002,
  PERMISSION_UPDATE: 3003,
  PERMISSION_DELETE: 3004,

  // Order permissions
  ORDER_CREATE: 4001,
  ORDER_READ: 4002,
  ORDER_UPDATE: 4003,
  ORDER_DELETE: 4004,
  ORDER_APPROVE: 4005,
  ORDER_REJECT: 4006,

  // Product permissions
  PRODUCT_CREATE: 5001,
  PRODUCT_READ: 5002,
  PRODUCT_UPDATE: 5003,
  PRODUCT_DELETE: 5004,
  PRODUCT_UPDATE_PRICE: 5005,
  FREE_ITEM_CREATE: 12001,
  FREE_ITEM_READ: 12002,
  FREE_ITEM_UPDATE: 12003,
  FREE_ITEM_DELETE: 12004,

  // Delivery permissions
  DELIVERY_CREATE: 6001,
  DELIVERY_READ: 6002,
  DELIVERY_UPDATE: 6003,
  DELIVERY_DELETE: 6004,
  DELIVERY_ASSIGN: 6005,

  // Seller permissions
  SELLER_CREATE: 7001,
  SELLER_READ: 7002,
  SELLER_UPDATE: 7003,
  SELLER_DELETE: 7004,

  // Payment permissions
  PAYMENT_CREATE: 8001,
  PAYMENT_READ: 8002,
  PAYMENT_UPDATE: 8003,
  PAYMENT_REFUND: 8004,

  // Report permissions
  REPORT_READ: 9002,
  REPORT_EXPORT: 9003,

  // Settings permissions
  SETTINGS_READ: 10002,
  SETTINGS_UPDATE: 10003,

  // User Management permissions (specific to user update/delete operations)
  USER_MANAGEMENT_UPDATE: 11002,
  USER_MANAGEMENT_DELETE: 11003,

  // Admin panel permissions
  ADMIN_PANEL_ACCESS: 11001,
} as const;

// Map permission codes to their action and resource
interface PermissionDef {
  code: number;
  resource: string;
  action: string;
  description: string;
}

const permissionDefs: PermissionDef[] = [
  // User permissions
  { code: 1001, resource: 'USER', action: 'CREATE', description: 'Create new users' },
  { code: 1002, resource: 'USER', action: 'READ', description: 'View user details' },
  { code: 1003, resource: 'USER', action: 'UPDATE', description: 'Update user information' },
  { code: 1004, resource: 'USER', action: 'DELETE', description: 'Delete users' },
  { code: 1005, resource: 'USER', action: 'APPROVE', description: 'Approve user registrations' },
  { code: 1006, resource: 'USER', action: 'REJECT', description: 'Reject user registrations' },

  // Role permissions
  { code: 2001, resource: 'ROLE', action: 'CREATE', description: 'Create new roles' },
  { code: 2002, resource: 'ROLE', action: 'READ', description: 'View roles' },
  { code: 2003, resource: 'ROLE', action: 'UPDATE', description: 'Update role definitions' },
  { code: 2004, resource: 'ROLE', action: 'DELETE', description: 'Delete roles' },

  // Permission management
  { code: 3001, resource: 'PERMISSION', action: 'CREATE', description: 'Create new permissions' },
  { code: 3002, resource: 'PERMISSION', action: 'READ', description: 'View permissions' },
  { code: 3003, resource: 'PERMISSION', action: 'UPDATE', description: 'Update permissions' },
  { code: 3004, resource: 'PERMISSION', action: 'DELETE', description: 'Delete permissions' },

  // Order permissions
  { code: 4001, resource: 'ORDER', action: 'CREATE', description: 'Create orders' },
  { code: 4002, resource: 'ORDER', action: 'READ', description: 'View orders' },
  { code: 4003, resource: 'ORDER', action: 'UPDATE', description: 'Update orders' },
  { code: 4004, resource: 'ORDER', action: 'DELETE', description: 'Delete orders' },
  { code: 4005, resource: 'ORDER', action: 'APPROVE', description: 'Approve orders' },
  { code: 4006, resource: 'ORDER', action: 'REJECT', description: 'Reject orders' },

  // Product permissions
  { code: 5001, resource: 'PRODUCT', action: 'CREATE', description: 'Create products' },
  { code: 5002, resource: 'PRODUCT', action: 'READ', description: 'View products' },
  { code: 5003, resource: 'PRODUCT', action: 'UPDATE', description: 'Update products' },
  { code: 5004, resource: 'PRODUCT', action: 'DELETE', description: 'Delete products' },
  { code: 5005, resource: 'PRODUCT', action: 'UPDATE', description: 'Set or update product price' },

  // Free item permissions
  { code: 12001, resource: 'FREE_ITEM', action: 'CREATE', description: 'Create free items' },
  { code: 12002, resource: 'FREE_ITEM', action: 'READ', description: 'View free items' },
  { code: 12003, resource: 'FREE_ITEM', action: 'UPDATE', description: 'Update free items' },
  { code: 12004, resource: 'FREE_ITEM', action: 'DELETE', description: 'Delete free items' },

  // Review permissions (managed under PRODUCT)
  // Note: Reviews are product-related, so they don't need separate resource
  
  // Delivery permissions
  { code: 6001, resource: 'DELIVERY', action: 'CREATE', description: 'Create deliveries' },
  { code: 6002, resource: 'DELIVERY', action: 'READ', description: 'View deliveries' },
  { code: 6003, resource: 'DELIVERY', action: 'UPDATE', description: 'Update deliveries' },
  { code: 6004, resource: 'DELIVERY', action: 'DELETE', description: 'Delete deliveries' },
  { code: 6005, resource: 'DELIVERY', action: 'APPROVE', description: 'Assign delivery personnel' },

  // Inventory permissions (managed under PRODUCT or SELLER)
  // Note: Inventory management is handled through PRODUCT or SELLER resources

  // Seller permissions
  { code: 7001, resource: 'SELLER', action: 'CREATE', description: 'Create seller accounts' },
  { code: 7002, resource: 'SELLER', action: 'READ', description: 'View seller information' },
  { code: 7003, resource: 'SELLER', action: 'UPDATE', description: 'Update seller information' },
  { code: 7004, resource: 'SELLER', action: 'DELETE', description: 'Delete seller accounts' },

  // Payment permissions
  { code: 8001, resource: 'PAYMENT', action: 'CREATE', description: 'Create payments' },
  { code: 8002, resource: 'PAYMENT', action: 'READ', description: 'View payments' },
  { code: 8003, resource: 'PAYMENT', action: 'UPDATE', description: 'Update payments' },
  { code: 8004, resource: 'PAYMENT', action: 'DELETE', description: 'Process refunds' },

  // Report permissions
  { code: 9002, resource: 'REPORT', action: 'READ', description: 'View reports' },
  { code: 9003, resource: 'REPORT', action: 'REJECT', description: 'Export reports' },

  // Settings permissions
  { code: 10002, resource: 'SETTINGS', action: 'READ', description: 'View settings' },
  { code: 10003, resource: 'SETTINGS', action: 'UPDATE', description: 'Update settings' },

  // User Management permissions
  { code: 11002, resource: 'USER', action: 'UPDATE', description: 'Permission to update user profiles' },
  { code: 11003, resource: 'USER', action: 'DELETE', description: 'Permission to delete user accounts' },

  // Admin panel access
  { code: 11001, resource: 'ADMIN_PANEL', action: 'APPROVE', description: 'Access admin panel' },
];

// Define default roles and their permissions
interface RoleDef {
  name: string;
  description: string;
  permissionCodes: number[];
}

const defaultRoles: RoleDef[] = [
  {
    name: 'SUPERADMIN',
    description: 'Super administrator with all permissions',
    permissionCodes: Object.values(PERMISSION_CODES),
  },
  {
    name: 'ADMIN',
    description: 'Administrator with managing permissions',
    permissionCodes: [
      PERMISSION_CODES.USER_READ,
      PERMISSION_CODES.USER_UPDATE,
      PERMISSION_CODES.USER_MANAGEMENT_UPDATE,
      PERMISSION_CODES.USER_MANAGEMENT_DELETE,
        PERMISSION_CODES.PRODUCT_UPDATE_PRICE,
      PERMISSION_CODES.USER_APPROVE,
      PERMISSION_CODES.ORDER_READ,
      PERMISSION_CODES.ORDER_UPDATE,
      PERMISSION_CODES.PRODUCT_READ,
      PERMISSION_CODES.PRODUCT_UPDATE,
      PERMISSION_CODES.PAYMENT_READ,
      PERMISSION_CODES.PAYMENT_UPDATE,
      PERMISSION_CODES.ADMIN_PANEL_ACCESS,
    ],
  },
  {
    name: 'MANAGER',
    description: 'Manager with operational permissions',
    permissionCodes: [
      PERMISSION_CODES.USER_READ,
      PERMISSION_CODES.USER_MANAGEMENT_UPDATE,
      PERMISSION_CODES.USER_MANAGEMENT_DELETE,
        PERMISSION_CODES.PRODUCT_UPDATE_PRICE,
      PERMISSION_CODES.ORDER_READ,
      PERMISSION_CODES.ORDER_UPDATE,
      PERMISSION_CODES.PRODUCT_READ,
      PERMISSION_CODES.PRODUCT_UPDATE,
      PERMISSION_CODES.DELIVERY_READ,
      PERMISSION_CODES.DELIVERY_UPDATE,
      PERMISSION_CODES.PAYMENT_READ,
      PERMISSION_CODES.REPORT_READ,
      PERMISSION_CODES.ADMIN_PANEL_ACCESS,
    ],
  },
  {
    name: 'SELLER',
    description: 'Seller/Vendor account',
    permissionCodes: [
      PERMISSION_CODES.PRODUCT_CREATE,
      PERMISSION_CODES.PRODUCT_READ,
      PERMISSION_CODES.PRODUCT_UPDATE,
      PERMISSION_CODES.FREE_ITEM_CREATE,
      PERMISSION_CODES.FREE_ITEM_READ,
      PERMISSION_CODES.FREE_ITEM_UPDATE,
      PERMISSION_CODES.FREE_ITEM_DELETE,
      PERMISSION_CODES.ORDER_READ,
      PERMISSION_CODES.PAYMENT_READ,
      PERMISSION_CODES.SELLER_READ,
      PERMISSION_CODES.SELLER_UPDATE,
      PERMISSION_CODES.REPORT_READ,
    ],
  },
  {
    name: 'VENDOR',
    description: 'Vendor account (alternative to SELLER)',
    permissionCodes: [
      PERMISSION_CODES.PRODUCT_CREATE,
      PERMISSION_CODES.PRODUCT_READ,
      PERMISSION_CODES.PRODUCT_UPDATE,
      PERMISSION_CODES.FREE_ITEM_CREATE,
      PERMISSION_CODES.FREE_ITEM_READ,
      PERMISSION_CODES.FREE_ITEM_UPDATE,
      PERMISSION_CODES.FREE_ITEM_DELETE,
      PERMISSION_CODES.ORDER_READ,
      PERMISSION_CODES.PAYMENT_READ,
    ],
  },
  {
    name: 'DELIVERY_MAN',
    description: 'Delivery personnel',
    permissionCodes: [
      PERMISSION_CODES.ORDER_READ,
      PERMISSION_CODES.ORDER_UPDATE,
      PERMISSION_CODES.DELIVERY_READ,
      PERMISSION_CODES.DELIVERY_UPDATE,
    ],
  },
  {
    name: 'CUSTOMER',
    description: 'Regular customer account',
    permissionCodes: [
      PERMISSION_CODES.ORDER_CREATE,
      PERMISSION_CODES.ORDER_READ,
      PERMISSION_CODES.PRODUCT_READ,
      PERMISSION_CODES.PAYMENT_CREATE,
      PERMISSION_CODES.PAYMENT_READ,
    ],
  },
];

async function main() {
  console.log('Starting database seed...');

  try {
    // System user ID (will be used as createdBy for default roles)
    const SYSTEM_USER_ID = 'system-seed-user';

    // 1. Create or retrieve all permissions
    console.log('Creating permissions...');
    const permissions = await Promise.all(
      permissionDefs.map((permDef) =>
        prisma.permission.upsert({
          where: { permissionCode: permDef.code },
          update: { description: permDef.description },
          create: {
            permissionCode: permDef.code,
            resource: permDef.resource as any,
            action: permDef.action as any,
            description: permDef.description,
            active: true,
          },
        })
      )
    );
    console.log(`Created/updated ${permissions.length} permissions`);

    // 2. Create default roles
    console.log('Creating default roles...');
    for (const roleDef of defaultRoles) {
      const existingRole = await prisma.role.findUnique({
        where: { name: roleDef.name },
      });

      if (existingRole) {
        console.log(`  Role "${roleDef.name}" already exists, skipping...`);
        continue;
      }

      // Create role
      const role = await prisma.role.create({
        data: {
          name: roleDef.name,
          description: roleDef.description,
          createdBy: SYSTEM_USER_ID,
        },
      });

      console.log(`  Created role: ${role.name}`);

      // Assign permissions to role
      const rolePermissions = await Promise.all(
        roleDef.permissionCodes.map((code) => {
          const permission = permissions.find((p) => p.permissionCode === code);
          if (!permission) {
            console.warn(`  Permission code ${code} not found`);
            return null;
          }
          return prisma.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId: permission.id,
              grantedBy: SYSTEM_USER_ID,
            },
          });
        })
      );

      const validAssignments = rolePermissions.filter((p) => p !== null).length;
      console.log(`  Assigned ${validAssignments} permissions to ${role.name}`);
    }

    console.log('\nDatabase seed completed successfully!');
    console.log('Default roles created:');
    defaultRoles.forEach((role) => {
      console.log(`   - ${role.name}: ${role.description}`);
    });
    console.log('\nSuperadmin can now modify role permissions as needed.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Call main and handle errors
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
