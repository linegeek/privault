import { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { FieldDefinition } from '../../../types';
import { CustomForm } from '../forms';

interface CredentialFiltersDialogProps {
  open: boolean;
  onClose: () => void;
  filterServiceName: string;
  setFilterServiceName: (value: string) => void;
  filterTags: string[];
  setFilterTags: (value: string[]) => void;
  filterNote: string;
  setFilterNote: (value: string) => void;
  allTags: string[];
}

export default function CredentialFiltersDialog({
  open,
  onClose,
  filterServiceName,
  setFilterServiceName,
  filterTags,
  setFilterTags,
  filterNote,
  setFilterNote,
  allTags,
}: CredentialFiltersDialogProps) {
  const fields: FieldDefinition[] = useMemo(
    () => [
      {
        name: 'filterServiceName',
        type: 'text' as const,
        label: 'Service Name',
        size: 'small',
      },
      {
        name: 'filterTags',
        type: 'tags' as const,
        label: 'Tags',
        options: allTags,
        size: 'small',
      },
      {
        name: 'filterNote',
        type: 'text' as const,
        label: 'Note',
        size: 'small',
      },
    ],
    [allTags],
  );

  const values = {
    filterServiceName,
    filterTags,
    filterNote,
  };

  const handleChange = (field: string, value: unknown) => {
    switch (field) {
      case 'filterServiceName':
        setFilterServiceName(value as string);
        break;
      case 'filterTags':
        setFilterTags(value as string[]);
        break;
      case 'filterNote':
        setFilterNote(value as string);
        break;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Search Filters
        <IconButton
          onClick={onClose}
          sx={{ color: 'rgba(255,255,255,0.8)' }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, pb: 2 }}>
          <CustomForm fields={fields} values={values} onChange={handleChange} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

