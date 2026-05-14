/**
 * run-migration.ts
 *
 * Greenfield bootstrap for the `review_portal` table — builds the current
 * "Pulse" schema (post-002) in a single idempotent run.
 *
 * For an existing v1 database (pre-Pulse), run `npm run db:migrate:002` instead;
 * it performs the in-place column upgrades.
 *
 * Usage:
 *   npm run db:migrate
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

    /* ──────────────────────────────────────────────
       ENUM types
    ────────────────────────────────────────────── */
    const ensureEnum = async (name: string, values: string[]) => {
      await client.query(`
        DO $$ BEGIN
          CREATE TYPE ${name} AS ENUM (${values.map((v) => `'${v}'`).join(", ")});
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      `);
    };

    await ensureEnum("review_platform", ["ambitionbox", "google", "glassdoor"]);
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
    await ensureEnum("pulse_department", [
      "product_engineering",
      "design",
      "growth_marketing",
      "client_delivery",
      "hr",
    ]);

    /* ──────────────────────────────────────────────
       Sequence + table
    ────────────────────────────────────────────── */
    await client.query(`
      CREATE SEQUENCE IF NOT EXISTS review_portal_employees_count_seq
        START 1 INCREMENT 1;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS review_portal (
        id              BIGSERIAL PRIMARY KEY,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

        -- Step 1: Profile
        employee_name   TEXT             NOT NULL,
        role            TEXT             NOT NULL,
        department      pulse_department NOT NULL,
        tenure          pulse_tenure     NOT NULL,

        -- Step 2: Feedback
        emotion         pulse_emotion    NOT NULL,
        energizers      TEXT[]           NOT NULL DEFAULT '{}',
        reflection      TEXT,
        improvements    TEXT,

        -- Step 3: Sharing
        platforms_visited review_platform[] NOT NULL DEFAULT '{}',

        -- Gamification
        points_earned   SMALLINT NOT NULL DEFAULT 0,
        employees_count INT      NOT NULL DEFAULT nextval('review_portal_employees_count_seq'),

        -- Submission metadata
        submitted_at    TIMESTAMPTZ,
        ip_address      INET,
        user_agent      TEXT
      );
    `);

    /* ──────────────────────────────────────────────
       Indexes
    ────────────────────────────────────────────── */
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_review_portal_created_at
        ON review_portal (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_review_portal_emotion_created
        ON review_portal (emotion, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_review_portal_department
        ON review_portal (department);
    `);

    /* ──────────────────────────────────────────────
       updated_at trigger
    ────────────────────────────────────────────── */
    await client.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER LANGUAGE plpgsql AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$;
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS trg_review_portal_updated_at ON review_portal;
      CREATE TRIGGER trg_review_portal_updated_at
        BEFORE UPDATE ON review_portal
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    `);

    await client.query("COMMIT");
    console.log(
      "✅  Bootstrap complete — `review_portal` is on the Pulse schema.",
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌  Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
