"use client";

import { ReactNode, useState } from "react";

interface Tab {
  label: string;
  value: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
  className?: string;
}

export default function Tabs({ tabs, defaultValue, className = "" }: TabsProps) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value ?? "");

  const current = tabs.find((t) => t.value === active);

  return (
    <div className={className}>
      {/* Tab list */}
      <div className="flex gap-1 border-b border-slate-200" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={tab.value === active}
            onClick={() => setActive(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              tab.value === active
                ? "text-accent"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {tab.value === active && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-accent rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pt-4" role="tabpanel">
        {current?.content}
      </div>
    </div>
  );
}
