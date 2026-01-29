export interface Credential {
  id: string;
  serviceName: string;
  username: string;
  password: string;
  tags: string[];
  note: string;
  customFields: Array<{ key: string; value: string }>;
}

