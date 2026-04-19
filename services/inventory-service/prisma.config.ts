import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('INVENTORY_DATABASE_URL'),
  },
  migrations: {
    path: './prisma/migrations',
  },
});
