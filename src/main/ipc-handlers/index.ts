import { ipcMain } from 'electron';
import { handleGetUserId, handleLogin, handleLogout } from './auth';
import {
  handleCreateCredential,
  handleDeleteCredential,
  handleGetCredentials,
  handleUpdateCredential,
} from './credentials';
import {
  handleCreateSubscription,
  handleDeleteSubscription,
  handleGetSubscriptions,
  handleUpdateSubscription,
} from './subscriptions';

export function setupIpcHandlers() {
  // Auth
  ipcMain.handle('auth:login', handleLogin);
  ipcMain.handle('auth:logout', handleLogout);
  ipcMain.handle('auth:getUserId', handleGetUserId);

  // Credentials
  ipcMain.handle('credentials:create', handleCreateCredential);
  ipcMain.handle('credentials:get', handleGetCredentials);
  ipcMain.handle('credentials:update', handleUpdateCredential);
  ipcMain.handle('credentials:delete', handleDeleteCredential);

  // Subscriptions
  ipcMain.handle('subscriptions:create', handleCreateSubscription);
  ipcMain.handle('subscriptions:get', handleGetSubscriptions);
  ipcMain.handle('subscriptions:update', handleUpdateSubscription);
  ipcMain.handle('subscriptions:delete', handleDeleteSubscription);
}
