import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.ANALYTICS_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/analytics_db',
  },
});
