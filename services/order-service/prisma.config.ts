import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: env('ORDER_DATABASE_URL'),
  },
});
