export function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function computeSubscriptionWindow(start: Date, months: number) {
  const startedAt = new Date(start);
  const endsAt = addMonths(startedAt, months);
  const graceEndsAt = addMonths(endsAt, 1);

  return { startedAt, endsAt, graceEndsAt };
}
