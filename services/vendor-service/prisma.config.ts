import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('VENDOR_DATABASE_URL', 'postgresql://user:password@localhost:5432/freeshop_vendor'),
  },
  migrations: {
    path: './prisma/migrations',
  },
});
