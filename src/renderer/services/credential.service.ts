import { Credential } from '../../types';

export async function getAllCredentials(): Promise<Credential[]> {
  try {
    const credentials =
      await window.electron.ipcRenderer.invoke('credentials:get');
    return credentials || [];
  } catch (error) {
    console.error('Error getting credentials:', error);
    return [];
  }
}

export async function createCredential(
  credential: Credential,
): Promise<boolean> {
  try {
    const result = await window.electron.ipcRenderer.invoke(
      'credentials:create',
      credential,
    );
    return result?.success ?? false;
  } catch (error) {
    console.error('Error saving credential:', error);
    return false;
  }
}

export async function updateCredential(
  credential: Credential,
): Promise<boolean> {
  try {
    const result = await window.electron.ipcRenderer.invoke(
      'credentials:update',
      credential,
    );
    return result?.success ?? false;
  } catch (error) {
    console.error('Error updating credential:', error);
    return false;
  }
}

export async function deleteCredential(id: string): Promise<boolean> {
  try {
    const result = await window.electron.ipcRenderer.invoke(
      'credentials:delete',
      id,
    );
    return result?.success ?? false;
  } catch (error) {
    console.error('Error deleting credential:', error);
    return false;
  }
}

