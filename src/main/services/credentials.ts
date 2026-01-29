import { Credential } from '../../types/common/credential';
import { DBRecord } from '../../types/main/db-record';
import { decryptData, encryptData } from '../utils/crypto';

export const toCredential = (record: DBRecord, password: string) => {
  try {
    const content = decryptData(record.content, password);
    const jsonObj: Partial<Credential> = JSON.parse(content);
    const tags = record.tags
      .split(',')
      .map((tag) => decryptData(tag, password));

    return {
      id: record.id,
      serviceName: jsonObj.serviceName,
      username: jsonObj.username,
      password: jsonObj.password,
      tags,
      note: jsonObj.note,
      customFields: jsonObj.customFields || [],
    } as Credential;
  } catch {
    return null;
  }
};

export const encryptCredential = (
  credential: Credential,
  password: string,
) => {
  const jsondata = JSON.stringify({
    serviceName: credential.serviceName,
    username: credential.username,
    password: credential.password,
    note: credential.note,
    customFields: credential.customFields || [],
  });
  const tags = (credential.tags || [])
    .map((tag) => encryptData(tag, password))
    .join(',');

  return {
    content: encryptData(jsondata, password),
    tags,
  };
};

