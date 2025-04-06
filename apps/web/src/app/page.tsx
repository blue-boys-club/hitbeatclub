'use client';

import { Toggle } from '@/components/ui';
import { useState } from 'react';

export default function Home() {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <Toggle onChange={(checked) => setChecked(checked)} disabled />
    </div>
  );
}
