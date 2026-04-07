import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.VENDOR_DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/vendor_db',
  },
});
