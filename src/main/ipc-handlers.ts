import { ipcMain } from 'electron';
import { getDatabase } from './database';
import { hashPassword, encryptData, decryptData } from './utils/crypto';
import type { Subscription } from '../types/common/subscription';
import type { ColumnVisibility } from '../types/common/columnVisibility';

let currentUserId: string | null = null;
let currentPassword: string | null = null;

export function setCurrentUser(userId: string, password: string) {
  currentUserId = userId;
  currentPassword = password;
}

export function clearCurrentUser() {
  currentUserId = null;
  currentPassword = null;
}

function requireAuth() {
  if (!currentUserId || !currentPassword) {
    throw new Error('User not authenticated');
  }
  return { userId: currentUserId, password: currentPassword };
}

// Authentication handlers
ipcMain.handle('auth:login', async (_event, password: string) => {
  const userId = hashPassword(password);
  setCurrentUser(userId, password);
  return { userId, success: true };
});

ipcMain.handle('auth:logout', async () => {
  clearCurrentUser();
  return { success: true };
});

ipcMain.handle('auth:getUserId', async () => {
  return currentUserId;
});

// Subscription handlers
ipcMain.handle('subscriptions:getAll', async () => {
  const { userId, password } = requireAuth();
  const db = getDatabase();

  const rows = db
    .prepare('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId) as Array<{
      id: string;
      user_id: string;
      service_name: string;
      due_date: string;
      amount: number;
      period: string;
      tags: string;
      note: string;
      active: number;
      created_at: number;
      updated_at: number;
    }>;

  return rows.map((row) => {
    const decrypted: Subscription = {
      id: row.id,
      serviceName: decryptData(row.service_name, password),
      dueDate: decryptData(row.due_date, password),
      amount: row.amount, // Amount is stored as number, not encrypted
      period: decryptData(row.period, password) as Subscription['period'],
      tags: JSON.parse(decryptData(row.tags, password)),
      note: decryptData(row.note, password),
      active: row.active === 1,
    };
    return decrypted;
  });
});

ipcMain.handle('subscriptions:create', async (_event, subscription: Subscription) => {
  const { userId, password } = requireAuth();
  const db = getDatabase();

  const now = Date.now();
  const encrypted: {
    id: string;
    user_id: string;
    service_name: string;
    due_date: string;
    amount: number;
    period: string;
    tags: string;
    note: string;
    active: number;
    created_at: number;
    updated_at: number;
  } = {
    id: subscription.id,
    user_id: userId,
    service_name: encryptData(subscription.serviceName, password),
    due_date: encryptData(subscription.dueDate, password),
    amount: subscription.amount, // Store amount as number, not encrypted
    period: encryptData(subscription.period, password),
    tags: encryptData(JSON.stringify(subscription.tags), password),
    note: encryptData(subscription.note, password),
    active: subscription.active ? 1 : 0,
    created_at: now,
    updated_at: now,
  };

  db.prepare(
    `INSERT INTO subscriptions (
      id, user_id, service_name, due_date, amount, period, tags, note, active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    encrypted.id,
    encrypted.user_id,
    encrypted.service_name,
    encrypted.due_date,
    encrypted.amount,
    encrypted.period,
    encrypted.tags,
    encrypted.note,
    encrypted.active,
    encrypted.created_at,
    encrypted.updated_at
  );

  return { success: true };
});

ipcMain.handle('subscriptions:update', async (_event, subscription: Subscription) => {
  const { userId, password } = requireAuth();
  const db = getDatabase();

  const now = Date.now();
  const encrypted: {
    service_name: string;
    due_date: string;
    amount: number;
    period: string;
    tags: string;
    note: string;
    active: number;
    updated_at: number;
  } = {
    service_name: encryptData(subscription.serviceName, password),
    due_date: encryptData(subscription.dueDate, password),
    amount: subscription.amount, // Store amount as number, not encrypted
    period: encryptData(subscription.period, password),
    tags: encryptData(JSON.stringify(subscription.tags), password),
    note: encryptData(subscription.note, password),
    active: subscription.active ? 1 : 0,
    updated_at: now,
  };

  db.prepare(
    `UPDATE subscriptions SET
      service_name = ?, due_date = ?, amount = ?, period = ?, tags = ?, note = ?, active = ?, updated_at = ?
    WHERE id = ? AND user_id = ?`
  ).run(
    encrypted.service_name,
    encrypted.due_date,
    encrypted.amount,
    encrypted.period,
    encrypted.tags,
    encrypted.note,
    encrypted.active,
    encrypted.updated_at,
    subscription.id,
    userId
  );

  return { success: true };
});

ipcMain.handle('subscriptions:delete', async (_event, id: string) => {
  const { userId } = requireAuth();
  const db = getDatabase();

  db.prepare('DELETE FROM subscriptions WHERE id = ? AND user_id = ?').run(id, userId);

  return { success: true };
});

// Column visibility handlers
ipcMain.handle('column-visibility:get', async () => {
  const { userId } = requireAuth();
  const db = getDatabase();

  const row = db
    .prepare('SELECT visibility FROM column_visibility WHERE user_id = ?')
    .get(userId) as { visibility: string } | undefined;

  if (row) {
    return JSON.parse(row.visibility) as ColumnVisibility;
  }

  return null;
});

ipcMain.handle('column-visibility:save', async (_event, visibility: ColumnVisibility) => {
  const { userId } = requireAuth();
  const db = getDatabase();

  const now = Date.now();
  const visibilityJson = JSON.stringify(visibility);

  db.prepare(
    `INSERT OR REPLACE INTO column_visibility (user_id, visibility, updated_at)
     VALUES (?, ?, ?)`
  ).run(userId, visibilityJson, now);

  return { success: true };
});
