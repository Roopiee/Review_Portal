import { Pool } from 'pg';

// Prevent multiple Pool instances during Next.js hot-reload in dev
const globalForPg = globalThis as typeof globalThis & { pgPool?: Pool };

if (!globalForPg.pgPool) {
  globalForPg.pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required for AWS RDS
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

export const pool = globalForPg.pgPool;

/** Convenience helper — run a query and return rows */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}
