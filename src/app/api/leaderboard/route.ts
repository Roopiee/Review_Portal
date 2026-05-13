import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Get top 5 employees by points
    const contributors = await query<{ employee_name: string; role: string; total_points: number }>(`
      SELECT employee_name, role, SUM(points_earned) as total_points
      FROM review_portal
      WHERE employee_name IS NOT NULL
      GROUP BY employee_name, role
      ORDER BY total_points DESC
      LIMIT 5;
    `);

    // Get latest employees_count
    const stats = await query<{ max_count: number }>(`
      SELECT MAX(employees_count) as max_count
      FROM review_portal;
    `);

    return NextResponse.json({
      contributors: contributors.map(c => ({
        name: c.employee_name,
        role: c.role,
        score: c.total_points
      })),
      totalEmployees: stats[0]?.max_count || 0
    });
  } catch (err) {
    console.error('[leaderboard] DB Error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
