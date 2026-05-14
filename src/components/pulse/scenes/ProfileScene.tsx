'use client';

import InlineInput from '../primitives/InlineInput';
import InlineSelect from '../primitives/InlineSelect';
import { DEPARTMENTS, TENURES, PulseFormData } from '../options';

interface Props {
  data: PulseFormData;
  update: (patch: Partial<PulseFormData>) => void;
}

export default function ProfileScene({ data, update }: Props) {
  return (
    <section className="scene active">
      <span className="eyebrow">
        <span className="num">01</span>
        <span className="bar" /> Profile
      </span>
      <h1 className="display">
        Let&rsquo;s begin <span className="grad">with you</span>.
      </h1>
      <p className="lede">
        A short, four-step review. Start by telling us a little about who you are right now.
      </p>

      <div className="compose">
        <span className="ln">
          My name is{' '}
          <InlineInput
            value={data.name}
            placeholder="your name"
            onChange={v => update({ name: v })}
          />
          ,
        </span>
        <span className="ln">
          I work in{' '}
          <InlineSelect
            value={data.department}
            placeholder="your department"
            options={DEPARTMENTS}
            onChange={v => update({ department: v as PulseFormData['department'] })}
          />{' '}
          as a{' '}
          <InlineInput
            value={data.role}
            placeholder="your role"
            onChange={v => update({ role: v })}
          />
          ,
        </span>
        <span className="ln">
          and I&rsquo;ve been here for{' '}
          <InlineSelect
            value={data.tenure}
            placeholder="your tenure"
            options={TENURES}
            onChange={v => update({ tenure: v as PulseFormData['tenure'] })}
          />
          .
        </span>
      </div>

    </section>
  );
}
