import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('VENDOR_DATABASE_URL'),
  },
  migrations: {
    path: './prisma/migrations',
  },
});
