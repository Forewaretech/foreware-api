import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Setup the connection pool using the standard 'pg' library
// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
// });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase/Render environments
  },
  max: 10,
  idleTimeoutMillis: 30000,
});

// 2. Initialize the Adapter
// This is the "Translator" between Prisma and the 'pg' library
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the PrismaClient constructor
export const prisma = new PrismaClient({ adapter });
