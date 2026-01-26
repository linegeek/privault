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

export function requireAuth() {
  if (!currentUserId || !currentPassword) {
    throw new Error('User not authenticated');
  }
  return { userId: currentUserId, password: currentPassword };
}

export function getUserId() {
  return currentUserId;
}
