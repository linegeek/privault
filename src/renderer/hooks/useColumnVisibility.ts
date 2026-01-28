import { useEffect, useState } from 'react';
import { getSelectedKeys, stringArrayToObject } from '../utils/object';
import { readItem, storeItem } from '../utils/storage';

export const useColumnVisibility = (
  storageKey: string,
  defaultColumns: string[],
) => {
  const [columnVisibility, setColumnVisibility] = useState(() =>
    stringArrayToObject(defaultColumns),
  );

  const toggleColumn = (column: string) => {
    setColumnVisibility((currentVisibility) => {
      const updatedVisibility = { ...currentVisibility };
      updatedVisibility[column] = !updatedVisibility[column];

      const selectedColumns = getSelectedKeys(updatedVisibility);
      storeItem(storageKey, selectedColumns.join(','));

      return updatedVisibility;
    });
  };

  useEffect(() => {
    const load = async () => {
      const savedVisibility = await readItem(storageKey);
      if (savedVisibility) {
        setColumnVisibility(stringArrayToObject(savedVisibility.split(',')));
      }
    };
    load();
  }, []);

  return {
    columnVisibility,
    toggleColumn,
  };
};
