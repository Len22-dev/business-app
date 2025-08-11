import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the client connection
// Use a singleton pattern to avoid creating multiple connections in development
// See: https://github.com/vercel/next.js/discussions/12229#discussioncomment-83166
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var client: postgres.Sql | undefined;
}

let client: postgres.Sql;

if (process.env.NODE_ENV === 'production') {
  client = postgres(process.env.DATABASE_URL);
} else {
  if (!global.client) {
    global.client = postgres(process.env.DATABASE_URL);
  }
  client = global.client;
}

// Create the Drizzle instance
export const db = drizzle(client, { schema });
