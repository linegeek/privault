export function stringArrayToObject(array: string[]) {
  return array.reduce<Record<string, boolean>>((obj, item) => {
    obj[item] = true;
    return obj;
  }, {});
}

export function getSelectedKeys(selection: Record<string, boolean>) {
  return Object.keys(selection).filter((k) => selection[k]);
}
