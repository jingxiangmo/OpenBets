import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: ".env.local" });

console.log("foo", process.env.TURSO_CONNECTION_URL);
console.log("bar", process.env.TURSO_AUTH_TOKEN);

export default defineConfig({
  schema: './db/schema.ts',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
