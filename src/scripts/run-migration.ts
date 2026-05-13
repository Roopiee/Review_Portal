/**
 * run-migration.ts
 *
 * Creates (or upgrades) the `review_portal` table in the PostgreSQL database
 * pointed to by DATABASE_URL in .env
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register src/scripts/run-migration.ts
 *   -- or --
 *   npx tsx src/scripts/run-migration.ts
 */

import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log('🔗  Connecting to database…');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    /* ──────────────────────────────────────────────
       ENUM types (idempotent)
    ────────────────────────────────────────────── */
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE review_platform AS ENUM ('ambitionbox', 'google', 'glassdoor');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    /* ──────────────────────────────────────────────
       Main submissions table
    ────────────────────────────────────────────── */
    // Create the sequence for employees_count (idempotent)
    await client.query(`
      CREATE SEQUENCE IF NOT EXISTS review_portal_employees_count_seq
        START 1 INCREMENT 1;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS review_portal (
        -- identity
        id              BIGSERIAL PRIMARY KEY,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

        -- Step 1: Basic Info
        employee_name   TEXT,                        -- null when anonymous
        team_lead       TEXT        NOT NULL,
        role            TEXT        NOT NULL,
        is_anonymous    BOOLEAN     NOT NULL DEFAULT false,

        -- Step 2: Feedback Details
        rating          SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
        likes           TEXT        NOT NULL,
        dislikes        TEXT,                        -- collected only when rating <= 3

        -- Step 3: External Review tracking
        platforms_visited  review_platform[]  NOT NULL DEFAULT '{}',

        -- Step 4: Image / screenshot proofs
        proof_ambitionbox_url   TEXT,
        proof_google_url        TEXT,
        proof_glassdoor_url     TEXT,

        -- Gamification
        points_earned   SMALLINT    NOT NULL DEFAULT 0,

        -- Running employee count (increments per submission)
        employees_count INT         NOT NULL DEFAULT nextval('review_portal_employees_count_seq'),

        -- Submission metadata
        submitted_at    TIMESTAMPTZ,
        ip_address      INET,
        user_agent      TEXT
      );
    `);

    // Add employees_count column to existing tables that pre-date this migration
    await client.query(`
      ALTER TABLE review_portal
        ADD COLUMN IF NOT EXISTS employees_count INT
          NOT NULL DEFAULT nextval('review_portal_employees_count_seq');
    `);

    /* ──────────────────────────────────────────────
       Indexes
    ────────────────────────────────────────────── */
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_review_portal_created_at
        ON review_portal (created_at DESC);

      CREATE INDEX IF NOT EXISTS idx_review_portal_rating
        ON review_portal (rating);

      CREATE INDEX IF NOT EXISTS idx_review_portal_team_lead
        ON review_portal (team_lead);
    `);

    /* ──────────────────────────────────────────────
       auto-update updated_at trigger
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

    await client.query('COMMIT');
    console.log('✅  Migration complete — table `review_portal` is ready.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
