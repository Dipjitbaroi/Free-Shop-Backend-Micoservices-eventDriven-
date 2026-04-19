import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('ORDER_DATABASE_URL', 'postgresql://user:password@localhost:5432/freeshop_order'),
  },
  migrations: {
    path: './prisma/migrations',
  },
});
