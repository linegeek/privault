import { Subscription } from '../../types/common/subscription';
import { DBRecord } from '../../types/main/db-record';
import { decryptData, encryptData } from '../utils/crypto';

export const toSubscription = (record: DBRecord, password: string) => {
  try {
    const content = decryptData(record.content, password);
    const jsonObj: Partial<Subscription> = JSON.parse(content);
    const tags = record.tags
      .split(',')
      .map((tag) => decryptData(tag, password));

    return {
      id: record.id,
      serviceName: jsonObj.serviceName,
      dueDate: jsonObj.dueDate,
      amount: jsonObj.amount,
      period: jsonObj.period,
      tags,
      note: jsonObj.note,
      active: jsonObj.active,
    } as Subscription;
  } catch {
    return null;
  }
};

export const encryptSubscription = (
  subscription: Subscription,
  password: string,
) => {
  const jsondata = JSON.stringify({
    serviceName: subscription.serviceName,
    dueDate: subscription.dueDate,
    amount: subscription.amount,
    period: subscription.period,
    note: subscription.note,
    active: subscription.active,
  });
  const tags = (subscription.tags || [])
    .map((tag) => encryptData(tag, password))
    .join(',');

  return {
    content: encryptData(jsondata, password),
    tags,
  };
};
