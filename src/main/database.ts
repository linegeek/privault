import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { hashPassword, encryptData, decryptData } from './utils/crypto';

const DB_NAME = 'privault.db';
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(app.getPath('userData'), DB_NAME);
    db = new Database(dbPath);
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  if (!db) return;

  // Create subscriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      service_name TEXT NOT NULL,
      due_date TEXT NOT NULL,
      amount REAL NOT NULL,
      period TEXT NOT NULL,
      tags TEXT NOT NULL,
      note TEXT NOT NULL,
      active INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  // Create column_visibility table
  db.exec(`
    CREATE TABLE IF NOT EXISTS column_visibility (
      user_id TEXT PRIMARY KEY,
      visibility TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
  `);
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
