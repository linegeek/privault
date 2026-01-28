import { Subscription } from '../../types';

export async function getAllSubscriptions(): Promise<Subscription[]> {
  try {
    const subscriptions =
      await window.electron.ipcRenderer.invoke('subscriptions:get');
    return subscriptions || [];
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
}

export async function createSubscription(
  subscription: Subscription,
): Promise<boolean> {
  try {
    const result = await window.electron.ipcRenderer.invoke(
      'subscriptions:create',
      subscription,
    );
    return result?.success ?? false;
  } catch (error) {
    console.error('Error saving subscription:', error);
    return false;
  }
}

export async function updateSubscription(
  subscription: Subscription,
): Promise<boolean> {
  try {
    const result = await window.electron.ipcRenderer.invoke(
      'subscriptions:update',
      subscription,
    );
    return result?.success ?? false;
  } catch (error) {
    console.error('Error updating subscription:', error);
    return false;
  }
}

export async function deleteSubscription(id: string): Promise<boolean> {
  try {
    const result = await window.electron.ipcRenderer.invoke(
      'subscriptions:delete',
      id,
    );
    return result?.success ?? false;
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return false;
  }
}
