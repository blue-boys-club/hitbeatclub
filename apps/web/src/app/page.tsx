"use client";

import { Toggle } from "@/components/ui";
import { useState } from "react";

export default function Home() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="p-4 space-y-4">
      <Toggle onChange={(checked) => setChecked(checked)} disabled />

      <p> Toggle: {checked ? "checked" : "unchecked"} </p>
    </div>
  );
}
