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
