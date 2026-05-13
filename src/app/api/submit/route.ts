import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

/* ─── types ─────────────────────────────────────────────── */
interface SubmitPayload {
  name: string;
  teamLead: string;
  role: string;
  isAnonymous: boolean;
  rating: number;
  likes: string;
  dislikes?: string;
  platformsVisited?: string[];   // 'ambitionbox' | 'google' | 'glassdoor'
  proofAmbitionboxUrl?: string;
  proofGoogleUrl?: string;
  proofGlassdoorUrl?: string;
}

/* ─── helper: points calculator ────────────────────────── */
function calcPoints(payload: SubmitPayload): number {
  let pts = 10; // base
  if ((payload.platformsVisited ?? []).length > 0) pts += payload.platformsVisited!.length * 50;
  if (payload.proofAmbitionboxUrl) pts += 50;
  if (payload.proofGoogleUrl)      pts += 50;
  if (payload.proofGlassdoorUrl)   pts += 50;
  return pts;
}

/* ─── POST /api/submit ──────────────────────────────────── */
export async function POST(req: NextRequest) {
  let body: SubmitPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  /* Basic validation */
  if (!body.teamLead || !body.role || !body.rating || !body.likes) {
    return NextResponse.json(
      { error: 'Missing required fields: teamLead, role, rating, likes' },
      { status: 422 }
    );
  }

  if (body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 422 });
  }

  const points = calcPoints(body);
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null;
  const ua = req.headers.get('user-agent') ?? null;

  const platformsArr =
    body.platformsVisited && body.platformsVisited.length > 0
      ? `{${body.platformsVisited.join(',')}}`
      : '{}';

  try {
    const rows = await query<{ id: string; points_earned: number; employees_count: number }>(
      `INSERT INTO review_portal (
          employee_name,
          team_lead,
          role,
          is_anonymous,
          rating,
          likes,
          dislikes,
          platforms_visited,
          proof_ambitionbox_url,
          proof_google_url,
          proof_glassdoor_url,
          points_earned,
          employees_count,
          submitted_at,
          ip_address,
          user_agent
       ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8::review_platform[],
          $9, $10, $11,
          $12,
          nextval('review_portal_employees_count_seq'),
          now(),
          $13::inet,
          $14
       )
       RETURNING id, points_earned, employees_count`,
      [
        body.isAnonymous ? null : body.name,
        body.teamLead,
        body.role,
        body.isAnonymous ?? false,
        body.rating,
        body.likes,
        body.dislikes ?? null,
        platformsArr,
        body.proofAmbitionboxUrl ?? null,
        body.proofGoogleUrl ?? null,
        body.proofGlassdoorUrl ?? null,
        points,
        ip,
        ua,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        id: rows[0].id,
        pointsEarned: rows[0].points_earned,
        employeesCount: rows[0].employees_count,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[submit] DB error:', err);
    return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 });
  }
}
