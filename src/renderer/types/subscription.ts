export type Period =
  | '1 week'
  | '1 month'
  | '3 months'
  | '6 months'
  | '1 year'
  | '2 years';

export interface Subscription {
  id: string;
  serviceName: string;
  dueDate: string;
  amount: number;
  period: Period;
  tags: string[];
  note: string;
  active: boolean;
}

export const PERIOD_OPTIONS: Period[] = [
  '1 week',
  '1 month',
  '3 months',
  '6 months',
  '1 year',
  '2 years',
];

export type ExpiryFilter = 'all' | 'expires_in_week' | 'expired_only';
