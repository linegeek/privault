export async function readItem(key: string) {
  return await localStorage.getItem(key);
}

export async function storeItem(key: string, value: string) {
  localStorage.setItem(key, value);
}
