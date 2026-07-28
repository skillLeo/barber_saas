import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({ className, width, height, rounded }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", rounded && "!rounded-full", className)}
      style={{ width, height: height || 16 }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} rounded />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton height={14} width="60%" />
          <Skeleton height={12} width="40%" />
        </div>
      </div>
      <Skeleton height={12} />
      <Skeleton height={12} width="80%" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <Skeleton width={32} height={32} rounded />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton height={13} width="45%" />
        <Skeleton height={11} width="30%" />
      </div>
      <Skeleton height={13} width={60} />
      <Skeleton height={22} width={70} className="!rounded-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--border)" }}>
          <SkeletonRow />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="stat-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton width={36} height={36} className="!rounded-xl" />
        <Skeleton width={50} height={18} className="!rounded-full" />
      </div>
      <div className="flex flex-col gap-1.5 mt-1">
        <Skeleton height={28} width="55%" />
        <Skeleton height={12} width="70%" />
      </div>
    </div>
  );
}
