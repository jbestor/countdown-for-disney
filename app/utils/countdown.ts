export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  isPast: boolean;
}

export function computeCountdown(tripDate: Date | null): CountdownResult {
  if (!tripDate) return { days: 0, hours: 0, minutes: 0, isPast: false };

  const now = new Date();
  const target = new Date(tripDate);
  target.setHours(0, 0, 0, 0);

  const nowMidnight = new Date(now);
  nowMidnight.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - nowMidnight.getTime();
  const isPast = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isPast };
}
