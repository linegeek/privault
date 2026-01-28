import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { TagsAutocomplete } from '../forms';

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
  const [localServiceName, setLocalServiceName] = useState(filterServiceName);
  const [localTags, setLocalTags] = useState(filterTags);
  const [localNote, setLocalNote] = useState(filterNote);

  useEffect(() => {
    if (open) {
      setLocalServiceName(filterServiceName);
      setLocalTags(filterTags);
      setLocalNote(filterNote);
    }
  }, [open, filterServiceName, filterTags, filterNote]);

  const handleClose = () => {
    setFilterServiceName(localServiceName);
    setFilterTags(localTags);
    setFilterNote(localNote);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Search Filters
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            size="small"
            label="Service Name"
            value={localServiceName}
            onChange={(e) => setLocalServiceName(e.target.value)}
            fullWidth
          />
          <TagsAutocomplete
            options={allTags}
            value={localTags}
            onChange={(_, v) => setLocalTags(v)}
            size="small"
          />
          <TextField
            size="small"
            label="Note"
            value={localNote}
            onChange={(e) => setLocalNote(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

