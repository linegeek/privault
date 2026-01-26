import { ipcMain } from 'electron';
import { handleGetUserId, handleLogin, handleLogout } from './auth';
import {
  handleCreateSubscription,
  handleDeleteSubscription,
  handleGetSubscriptions,
  handleUpdateSubscription,
} from './subscriptions';

// Auth
ipcMain.handle('auth:login', handleLogin);
ipcMain.handle('auth:logout', handleLogout);
ipcMain.handle('auth:getUserId', handleGetUserId);

// Subscriptions
ipcMain.handle('subscriptions:create', handleCreateSubscription);
ipcMain.handle('subscriptions:get', handleGetSubscriptions);
ipcMain.handle('subscriptions:update', handleUpdateSubscription);
ipcMain.handle('subscriptions:delete', handleDeleteSubscription);
