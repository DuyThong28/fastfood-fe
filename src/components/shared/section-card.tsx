import { ReactNode } from "react";

interface SectionCardProps {
  children?: ReactNode;
  className?: string;
}

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`rounded-lg border border-dashed shadow-sm w-full bg-white ${className}`}
    >
      {children}
    </div>
  );
}
