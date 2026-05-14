/**
 * 002-pulse-schema.ts
 *
 * In-place upgrade from the original review_portal schema (team_lead, rating,
 * likes/dislikes, is_anonymous, 3 proof URLs) to the Pulse schema (department,
 * tenure, emotion, energizers, reflection, improvements).
 *
 * Idempotent — safe to run multiple times.
 *
 * Usage:
 *   npm run db:migrate:002
 */

import "dotenv/config";
import { Pool } from "pg";

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log("🔗  Connecting to database…");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* New ENUM types */
    const ensureEnum = async (name: string, values: string[]) => {
      await client.query(`
        DO $$ BEGIN
          CREATE TYPE ${name} AS ENUM (${values.map((v) => `'${v}'`).join(", ")});
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      `);
    };

    await ensureEnum("pulse_emotion", [
      "drained",
      "neutral",
      "okay",
      "good",
      "great",
    ]);
    await ensureEnum("pulse_tenure", [
      "lt_6m",
      "m6_12",
      "y1_3",
      "y3_5",
      "y5_plus",
    ]);
    await ensureEnum("department", [
      "finance",
      "compliance_legal",
      "hr_admin",
      "admin",
      "welocity_pre_sales",
      "welocity_sales",
      "welocity_engineering",
    ]);

    /* Add new columns. For an existing table with rows we can't make these NOT NULL
       in the same transaction without a default — keep them nullable here and let
       the API enforce required-ness for new submissions. A subsequent migration can
       backfill historical rows and tighten the constraint if desired. */
    await client.query(`
      ALTER TABLE review_portal
        ADD COLUMN IF NOT EXISTS department  department,
        ADD COLUMN IF NOT EXISTS tenure      pulse_tenure,
        ADD COLUMN IF NOT EXISTS emotion     pulse_emotion,
        ADD COLUMN IF NOT EXISTS energizers  TEXT[] NOT NULL DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS reflection  TEXT,
        ADD COLUMN IF NOT EXISTS improvements TEXT;
    `);

    /* Drop legacy columns no longer collected. */
    await client.query(`
      ALTER TABLE review_portal
        DROP COLUMN IF EXISTS team_lead,
        DROP COLUMN IF EXISTS is_anonymous,
        DROP COLUMN IF EXISTS rating,
        DROP COLUMN IF EXISTS likes,
        DROP COLUMN IF EXISTS dislikes,
        DROP COLUMN IF EXISTS proof_ambitionbox_url,
        DROP COLUMN IF EXISTS proof_google_url,
        DROP COLUMN IF EXISTS proof_glassdoor_url,
        DROP COLUMN IF EXISTS work_style,
        DROP COLUMN IF EXISTS alignment;
    `);

    /* Drop now-unused enum types (no-op if they're already gone). */
    await client.query(`DROP TYPE IF EXISTS pulse_work_style;`);
    await client.query(`DROP TYPE IF EXISTS pulse_alignment;`);

    /* Tighten employee_name (was nullable for anon submissions; anon is gone). */
    // Backfill any null names so the NOT NULL constraint can be applied safely.
    await client.query(
      `UPDATE review_portal SET employee_name = 'Anonymous' WHERE employee_name IS NULL;`,
    );
    await client.query(
      `ALTER TABLE review_portal ALTER COLUMN employee_name SET NOT NULL;`,
    );

    /* Replace indexes. */
    await client.query(`DROP INDEX IF EXISTS idx_review_portal_rating;`);
    await client.query(`DROP INDEX IF EXISTS idx_review_portal_team_lead;`);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_review_portal_emotion_created
        ON review_portal (emotion, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_review_portal_department
        ON review_portal (department);
    `);

    await client.query("COMMIT");
    console.log("✅  002-pulse-schema applied.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌  Migration 002 failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
