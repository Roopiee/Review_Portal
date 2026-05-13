import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Medal } from 'lucide-react';

interface Contributor {
  name: string;
  role: string;
  count: number;
  avatar: string;
  medal: string | null;
}

export default function Leaderboard() {
  const [contributors, setContributors] = useState<Contributor[]>([
    { name: 'Roopieee', role: 'Frontend Lead', count: 12, avatar: 'R', medal: '🥇' },
    { name: 'Aruzaa', role: 'Product Manager', count: 9, avatar: 'A', medal: '🥈' },
    { name: 'Yuvi', role: 'UX Designer', count: 7, avatar: 'Y', medal: '🥉' },
    { name: 'murlibro', role: 'Backend Dev', count: 5, avatar: 'M', medal: null },
    { name: 'sunilbro', role: 'Data Scientist', count: 4, avatar: 'S', medal: null },
  ]);
  const [totalSubmissions, setTotalSubmissions] = useState(2000);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.contributors && data.contributors.length > 0) {
          setContributors(data.contributors.map((c: any, i: number) => ({
            name: c.name,
            role: c.role,
            count: c.score,
            avatar: c.name.substring(0, 1).toUpperCase(),
            medal: i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null,
          })));
        }
        if (data.totalEmployees) {
          setTotalSubmissions(data.totalEmployees);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const maxCount = contributors[0]?.count || 1;

  return (
    <div className="rounded-2xl overflow-hidden sticky top-24"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
      }}>
        
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-0.5">
          <Trophy size={16} style={{ color: '#C9A84C' }} />
          <h3 className="text-white font-bold text-sm tracking-wide">Top Contributors</h3>
        </div>
        <p className="text-white/35 text-xs">Most reviews submitted this month</p>
      </div>

      {/* List */}
      <div className="px-5 py-4 space-y-4">
        {contributors.map((person, index) => {
          const barWidth = Math.round((person.count / maxCount) * 100);

          return (
            <div key={person.name} className="group">
              <div className="flex items-center gap-3 mb-1.5">
                {/* Rank */}
                <div className="w-5 text-center">
                  {person.medal
                    ? <span className="text-sm">{person.medal}</span>
                    : <span className="text-xs font-bold text-white/25">#{index + 1}</span>
                  }
                </div>

                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: index === 0
                      ? 'linear-gradient(135deg, #C9A84C, #A67C2E)'
                      : index === 1
                      ? 'linear-gradient(135deg, #94A3B8, #64748B)'
                      : index === 2
                      ? 'linear-gradient(135deg, #C97C4C, #A6622E)'
                      : 'rgba(255,255,255,0.1)',
                    color: index < 3 ? 'white' : 'rgba(255,255,255,0.5)',
                    boxShadow: index === 0 ? '0 2px 8px rgba(201,168,76,0.4)' : 'none',
                  }}
                >
                  {person.avatar}
                </div>

                {/* Name + role */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{person.name}</p>
                  <p className="text-white/35 text-[10px] truncate">{person.role}</p>
                </div>

                {/* Count */}
                <div className="text-xs font-bold" style={{ color: index === 0 ? '#C9A84C' : 'rgba(255,255,255,0.4)' }}>
                  {person.count}
                </div>
              </div>

              {/* Progress bar */}
              <div className="ml-8 h-[3px] rounded-full bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${barWidth}%`,
                    background: index === 0
                      ? 'linear-gradient(90deg, #C9A84C, #E8D5A0)'
                      : index === 1
                      ? 'rgba(255,255,255,0.25)'
                      : 'rgba(255,255,255,0.15)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={13} style={{ color: '#C9A84C' }} />
            <span className="text-white/50 text-xs font-medium">Monthly Target</span>
          </div>
          <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>75%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full"
            style={{ width: '75%', background: 'linear-gradient(90deg, #C9A84C, #E8D5A0)' }}
          />
        </div>
        <p className="text-white/25 text-[10px] mt-2 uppercase tracking-wider font-semibold">
          {totalSubmissions} of 500 Target Achieved
        </p>
      </div>
    </div>
  );
}
