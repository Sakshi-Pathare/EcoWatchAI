import React from 'react';

export function LoadingSkeleton({ count = 3, height = 'h-20' }) {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-full bg-sage-100/70 animate-pulse rounded-xl ${height}`}
        />
      ))}
    </div>
  );
}

