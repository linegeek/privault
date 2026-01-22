import type { Subscription } from '../types/subscription';

export interface ColumnVisibility extends Record<string, boolean> {
  no: boolean;
  serviceName: boolean;
  dueDate: boolean;
  amount: boolean;
  period: boolean;
  tags: boolean;
  note: boolean;
  active: boolean;
}

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  no: true,
  serviceName: true,
  dueDate: true,
  amount: true,
  period: true,
  tags: true,
  note: true,
  active: true,
};

export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const subscriptions = await window.electron.ipcRenderer.invoke('subscriptions:getAll');
    return subscriptions || [];
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
}

export async function saveSubscription(subscription: Subscription): Promise<boolean> {
  try {
    const result = await window.electron.ipcRenderer.invoke('subscriptions:create', subscription);
    return result?.success ?? false;
  } catch (error) {
    console.error('Error saving subscription:', error);
    return false;
  }
}

export async function updateSubscription(subscription: Subscription): Promise<boolean> {
  try {
    const result = await window.electron.ipcRenderer.invoke('subscriptions:update', subscription);
    return result?.success ?? false;
  } catch (error) {
    console.error('Error updating subscription:', error);
    return false;
  }
}

export async function deleteSubscription(id: string): Promise<boolean> {
  try {
    const result = await window.electron.ipcRenderer.invoke('subscriptions:delete', id);
    return result?.success ?? false;
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return false;
  }
}

export async function getColumnVisibility(): Promise<ColumnVisibility> {
  try {
    const visibility = await window.electron.ipcRenderer.invoke('column-visibility:get');
    if (visibility) {
      return { ...DEFAULT_COLUMN_VISIBILITY, ...visibility } as ColumnVisibility;
    }
  } catch (error) {
    console.error('Error getting column visibility:', error);
  }
  return DEFAULT_COLUMN_VISIBILITY;
}

export async function saveColumnVisibility(visibility: ColumnVisibility): Promise<boolean> {
  try {
    const result = await window.electron.ipcRenderer.invoke('column-visibility:save', visibility);
    return result?.success ?? false;
  } catch (error) {
    console.error('Error saving column visibility:', error);
    return false;
  }
}
