import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const EMOTIONS = ['drained', 'neutral', 'okay', 'good', 'great'] as const;
const TENURES = ['lt_6m', 'm6_12', 'y1_3', 'y3_5', 'y5_plus'] as const;
const DEPARTMENTS = [
  'product_engineering',
  'design',
  'growth_marketing',
  'client_delivery',
  'hr',
] as const;
const PLATFORMS = ['ambitionbox', 'google', 'glassdoor'] as const;

type Emotion = (typeof EMOTIONS)[number];
type Tenure = (typeof TENURES)[number];
type Department = (typeof DEPARTMENTS)[number];
type Platform = (typeof PLATFORMS)[number];

interface SubmitPayload {
  name: string;
  role: string;
  department: Department;
  tenure: Tenure;
  emotion: Emotion;
  energizers: string[];
  reflection?: string;
  improvements?: string;
  platformsVisited?: Platform[];
}

// 10 base + 5 per energizer (cap 25) + 50 per shared platform.
function calcPoints(p: SubmitPayload): number {
  const energizerPts = Math.min(25, (p.energizers?.length ?? 0) * 5);
  const platformPts = (p.platformsVisited?.length ?? 0) * 50;
  return 10 + energizerPts + platformPts;
}

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

export async function POST(req: NextRequest) {
  let body: SubmitPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Required string fields
  if (!body.name?.trim() || !body.role?.trim()) {
    return NextResponse.json({ error: 'name and role are required' }, { status: 422 });
  }

  // Enum validation
  if (!isOneOf(body.department, DEPARTMENTS))
    return NextResponse.json({ error: 'Invalid department' }, { status: 422 });
  if (!isOneOf(body.tenure, TENURES))
    return NextResponse.json({ error: 'Invalid tenure' }, { status: 422 });
  if (!isOneOf(body.emotion, EMOTIONS))
    return NextResponse.json({ error: 'Invalid emotion' }, { status: 422 });

  const energizers = Array.isArray(body.energizers) ? body.energizers.filter(e => typeof e === 'string') : [];
  const platforms = Array.isArray(body.platformsVisited)
    ? body.platformsVisited.filter((p): p is Platform => isOneOf(p, PLATFORMS))
    : [];
  if (platforms.length !== (body.platformsVisited?.length ?? 0)) {
    return NextResponse.json({ error: 'Invalid platform value' }, { status: 422 });
  }

  const points = calcPoints({ ...body, energizers, platformsVisited: platforms });
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null;
  const ua = req.headers.get('user-agent') ?? null;

  try {
    const rows = await query<{ id: string; points_earned: number; employees_count: number }>(
      `INSERT INTO review_portal (
          employee_name,
          role,
          department,
          tenure,
          emotion,
          energizers,
          reflection,
          improvements,
          platforms_visited,
          points_earned,
          employees_count,
          submitted_at,
          ip_address,
          user_agent
       ) VALUES (
          $1, $2,
          $3::pulse_department,
          $4::pulse_tenure,
          $5::pulse_emotion,
          $6::text[],
          $7,
          $8,
          $9::review_platform[],
          $10,
          nextval('review_portal_employees_count_seq'),
          now(),
          $11::inet,
          $12
       )
       RETURNING id, points_earned, employees_count`,
      [
        body.name.trim(),
        body.role.trim(),
        body.department,
        body.tenure,
        body.emotion,
        energizers,
        body.reflection?.trim() || null,
        body.improvements?.trim() || null,
        platforms,
        points,
        ip,
        ua,
      ],
    );

    return NextResponse.json(
      {
        success: true,
        id: rows[0].id,
        pointsEarned: rows[0].points_earned,
        employeesCount: rows[0].employees_count,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error('[submit] DB error:', err);
    return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 });
  }
}
