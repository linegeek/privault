import { ReactNode } from 'react';

export interface ColumnDefinition<T = unknown> {
  key: string;
  label: string;
  visible: boolean;
  render?: (value: unknown, row: T, index?: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

