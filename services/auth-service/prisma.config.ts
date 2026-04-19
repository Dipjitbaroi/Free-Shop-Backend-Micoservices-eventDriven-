import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // Use fallback during build (prisma generate), actual value at runtime
    url: env('AUTH_DATABASE_URL', 'postgresql://user:password@localhost:5432/freeshop_auth'),
  },
  migrations: {
    path: './prisma/migrations',
    seed: './prisma/seed.ts',
  },
});
