import { requireAuth } from '../services/auth';
import { getDatabase } from '../database';
import { DBRecord } from '../../types/main/db-record';
import { encryptSubscription, toSubscription } from '../services/subscriptions';
import { IpcMainInvokeEvent } from 'electron';
import { Subscription } from '../../types/common/subscription';
import { encryptData, generateId } from '../utils/crypto';
import { DBSearchFilter } from '../../types/common/searchFilter';

export const handleGetSubscriptions = async (
  _event: IpcMainInvokeEvent,
  filter: DBSearchFilter,
) => {
  const { userId, password } = requireAuth();
  const db = getDatabase();

  const whereConditions = ['user_id = ?'];
  filter.tags.forEach((tag) => {
    const encryptedTag = encryptData(tag, password);

    whereConditions.push(`tags LIKE '%${encryptedTag}%'`);
  });

  const rows = db
    .prepare(
      `SELECT * FROM subscriptions WHERE ${whereConditions.join(' AND ')} ORDER BY created_at DESC`,
    )
    .all(userId) as DBRecord[];

  return rows.map((row) => toSubscription(row, password));
};

export const handleCreateSubscription = async (
  _event: IpcMainInvokeEvent,
  subscription: Subscription,
) => {
  const { userId, password } = requireAuth();
  const db = getDatabase();

  const now = Date.now();
  const id = generateId();
  const { content, tags } = encryptSubscription(subscription, password);

  db.prepare(
    `INSERT INTO subscriptions (
      id, user_id, content, tags, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, userId, content, tags, now, now);

  subscription.id = id;

  return { success: true, subscription };
};

export const handleUpdateSubscription = async (
  _event: IpcMainInvokeEvent,
  subscription: Subscription,
) => {
  const { userId, password } = requireAuth();
  const db = getDatabase();

  const now = Date.now();
  const { content, tags } = encryptSubscription(subscription, password);

  db.prepare(
    `UPDATE subscriptions SET
      content = ?, tags = ?, updated_at = ?
    WHERE id = ? AND user_id = ?`,
  ).run(content, tags, now, subscription.id, userId);
};

export const handleDeleteSubscription = async (
  _event: IpcMainInvokeEvent,
  id: string,
) => {
  const { userId } = requireAuth();
  const db = getDatabase();

  db.prepare('DELETE FROM subscriptions WHERE id = ? AND user_id = ?').run(
    id,
    userId,
  );

  return { success: true };
};
