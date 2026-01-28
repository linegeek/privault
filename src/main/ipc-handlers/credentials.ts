import { IpcMainInvokeEvent } from 'electron';
import { getDatabase } from '../database';
import { DBRecord, Credential, DBSearchFilter } from '../../types';
import { requireAuth, encryptCredential, toCredential } from '../services';
import { encryptData, generateId } from '../utils';

export const handleGetCredentials = async (
  _event: IpcMainInvokeEvent,
  filter: DBSearchFilter,
) => {
  const { userId, password } = requireAuth();
  const db = getDatabase();

  const whereConditions = ['user_id = ?'];
  const params: unknown[] = [userId];

  if (filter?.tags && filter.tags.length > 0) {
    filter.tags.forEach((tag) => {
      const encryptedTag = encryptData(tag, password);
      whereConditions.push('tags LIKE ?');
      params.push(`%${encryptedTag}%`);
    });
  }

  const rows = db
    .prepare(
      `SELECT * FROM credentials WHERE ${whereConditions.join(' AND ')} ORDER BY created_at DESC`,
    )
    .all(...params) as DBRecord[];

  return rows.map((row) => toCredential(row, password));
};

export const handleCreateCredential = async (
  _event: IpcMainInvokeEvent,
  credential: Credential,
) => {
  const { userId, password } = requireAuth();
  const db = getDatabase();

  const now = Date.now();
  const id = generateId();
  const { content, tags } = encryptCredential(credential, password);

  db.prepare(
    `INSERT INTO credentials (
      id, user_id, content, tags, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, userId, content, tags, now, now);

  credential.id = id;

  return { success: true, credential };
};

export const handleUpdateCredential = async (
  _event: IpcMainInvokeEvent,
  credential: Credential,
) => {
  const { userId, password } = requireAuth();
  const db = getDatabase();

  const now = Date.now();
  const { content, tags } = encryptCredential(credential, password);

  db.prepare(
    `UPDATE credentials SET
      content = ?, tags = ?, updated_at = ?
    WHERE id = ? AND user_id = ?`,
  ).run(content, tags, now, credential.id, userId);

  return { success: true };
};

export const handleDeleteCredential = async (
  _event: IpcMainInvokeEvent,
  id: string,
) => {
  const { userId } = requireAuth();
  const db = getDatabase();

  db.prepare('DELETE FROM credentials WHERE id = ? AND user_id = ?').run(
    id,
    userId,
  );

  return { success: true };
};

