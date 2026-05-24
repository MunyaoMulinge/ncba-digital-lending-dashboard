'use client';

interface CreditScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function CreditScoreRing({ score, size = 160, strokeWidth = 12 }: CreditScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((score - 300) / 550, 0), 1);
  const dashOffset = circumference * (1 - percentage);

  let color = '#ef4444'; // red
  if (score >= 700) color = '#10b981'; // green
  else if (score >= 600) color = '#f59e0b'; // yellow

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Credit Score</span>
      </div>
    </div>
  );
}
