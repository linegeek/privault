import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

export interface ColumnDefinition<T = unknown> {
  key: string;
  label: string;
  visible: boolean;
  render?: (value: unknown, row: T, index?: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  sx?: SxProps<Theme>;
}

