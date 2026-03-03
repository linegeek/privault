import { Period } from '../common/subscription';

export interface SubscriptionFormData {
  serviceName: string;
  dueDate: string;
  amount: string;
  period: Period;
  tags: string[];
  note: string;
  active: boolean;
  important: boolean;
}
