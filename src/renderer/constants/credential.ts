export const CREDENTIAL_COLUMN_LABELS: Record<string, string> = {
  no: 'No',
  serviceName: 'Service Name',
  username: 'Username',
  password: 'Password',
  tags: 'Tags',
  actions: 'Actions',
};

export const DEFAULT_VISIBLE_CREDENTIAL_COLUMNS: string[] = [
  'no',
  'serviceName',
  'username',
  'password',
  'tags',
  'actions',
];

export const CREDENTIAL_COLUMN_VISIBILITY_STORAGE_KEY =
  'column-visibility-credentials';

