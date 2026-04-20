import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Allow prisma generate to run without database connection during build
const databaseUrl = process.env.AUTH_DATABASE_URL || 'postgresql://user:password@localhost:5432/freeshop_auth';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    path: './prisma/migrations',
    seed: './prisma/seed.ts',
  },
});
