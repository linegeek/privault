import type { Subscription } from '../types/subscription';

const SUBSCRIPTIONS_KEY = 'privault-subscriptions';
const COLUMN_VISIBILITY_KEY = 'privault-subscriptions-column-visibility';

export interface ColumnVisibility extends Record<string, boolean> {
  no: boolean;
  serviceName: boolean;
  dueDate: boolean;
  amount: boolean;
  period: boolean;
  tags: boolean;
  note: boolean;
  active: boolean;
}

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  no: true,
  serviceName: true,
  dueDate: true,
  amount: true,
  period: true,
  tags: true,
  note: true,
  active: true,
};

export function getSubscriptions(): Subscription[] {
  try {
    const data = localStorage.getItem(SUBSCRIPTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSubscriptions(subscriptions: Subscription[]): void {
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
}

export function getColumnVisibility(): ColumnVisibility {
  try {
    const data = localStorage.getItem(COLUMN_VISIBILITY_KEY);
    if (data) {
      const parsed = JSON.parse(data) as Partial<ColumnVisibility>;
      return { ...DEFAULT_COLUMN_VISIBILITY, ...parsed } as ColumnVisibility;
    }
  } catch {
    // ignore
  }
  return DEFAULT_COLUMN_VISIBILITY;
}

export function saveColumnVisibility(visibility: ColumnVisibility): void {
  localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(visibility));
}
