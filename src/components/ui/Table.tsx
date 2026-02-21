import { ReactNode } from "react";

/* ─── Building blocks ──────────────────────────────────── */

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr className={`hover:bg-slate-50/60 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  header = false,
  className = "",
}: {
  children: ReactNode;
  header?: boolean;
  className?: string;
}) {
  const Tag = header ? "th" : "td";
  return (
    <Tag
      className={`px-4 py-3 whitespace-nowrap ${
        header ? "text-xs uppercase tracking-wider" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
