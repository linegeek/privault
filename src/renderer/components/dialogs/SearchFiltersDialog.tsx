import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ExpiryFilter } from '../../../types';
import { TagsAutocomplete } from '../index';

interface SearchFiltersDialogProps {
  open: boolean;
  onClose: () => void;
  filterServiceName: string;
  setFilterServiceName: (value: string) => void;
  filterExpiry: ExpiryFilter;
  setFilterExpiry: (value: ExpiryFilter) => void;
  filterActive: boolean;
  setFilterActive: (value: boolean) => void;
  filterTags: string[];
  setFilterTags: (value: string[]) => void;
  filterNote: string;
  setFilterNote: (value: string) => void;
  allTags: string[];
}

export default function SearchFiltersDialog({
  open,
  onClose,
  filterServiceName,
  setFilterServiceName,
  filterExpiry,
  setFilterExpiry,
  filterActive,
  setFilterActive,
  filterTags,
  setFilterTags,
  filterNote,
  setFilterNote,
  allTags,
}: SearchFiltersDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            size="small"
            label="Service Name"
            value={filterServiceName}
            onChange={(e) => setFilterServiceName(e.target.value)}
            fullWidth
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Expiry</InputLabel>
            <Select
              value={filterExpiry}
              label="Expiry"
              onChange={(e: SelectChangeEvent<ExpiryFilter>) =>
                setFilterExpiry(e.target.value as ExpiryFilter)
              }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="expires_in_week">Expires in a week</MenuItem>
              <MenuItem value="expired_only">Expired Only</MenuItem>
            </Select>
          </FormControl>
          <TagsAutocomplete
            options={allTags}
            value={filterTags}
            onChange={(_, v) => setFilterTags(v)}
            size="small"
          />
          <TextField
            size="small"
            label="Note"
            value={filterNote}
            onChange={(e) => setFilterNote(e.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterActive}
                onChange={(e) => setFilterActive(e.target.checked)}
              />
            }
            label="Active"
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

