import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.AUTH_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/auth_db',
  },
});
