import { IpcMainInvokeEvent } from 'electron';
import { hashPassword } from '../utils/crypto';
import { clearCurrentUser, getUserId, setCurrentUser } from '../services/auth';

export const handleLogin = async (
  _event: IpcMainInvokeEvent,
  password: string,
) => {
  const userId = hashPassword(password);
  setCurrentUser(userId, password);
  return { userId, success: true };
};

export const handleLogout = async () => {
  clearCurrentUser();
  return { success: true };
};

export const handleGetUserId = async () => {
  return getUserId();
};
