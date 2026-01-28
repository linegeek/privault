import { SvgIconComponent } from '@mui/icons-material';

export interface RowAction<T = unknown> {
  icon: SvgIconComponent;
  onClick: (row: T) => void;
  color?: string;
  title?: string;
}
