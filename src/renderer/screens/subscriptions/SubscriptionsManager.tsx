import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControlLabel,
  Checkbox,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { Subscription, Period } from '../../../types/common/subscription';
import type { ExpiryFilter } from '../../../types/renderer/subscription';
import type { ColumnVisibility } from '../../../types/common/columnVisibility';
import { PERIOD_OPTIONS } from '../../constants/subscription';
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getColumnVisibility,
  saveColumnVisibility,
} from '../../services/subscriptionService';
import {
  ScreenLayout,
  PageHeader,
  GradientButton,
  FormDialog,
  CurrencyField,
  TagsAutocomplete,
  ColumnVisibilityMenu,
} from '../../components';

const COLUMN_LABELS: Record<keyof ColumnVisibility, string> = {
  no: 'No',
  serviceName: 'Service Name',
  dueDate: 'Due Date',
  amount: 'Amount',
  period: 'Period',
  tags: 'Tags',
  note: 'Note',
  active: 'Active',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function isExpired(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

function expiresInWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return d >= now && d <= weekFromNow;
}

interface SubscriptionFormData {
  serviceName: string;
  dueDate: string;
  amount: string;
  period: Period;
  tags: string[];
  note: string;
  active: boolean;
}

const emptyForm: SubscriptionFormData = {
  serviceName: '',
  dueDate: '',
  amount: '',
  period: '1 month',
  tags: [],
  note: '',
  active: true,
};

interface SubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SubscriptionFormData) => void;
  initial?: Subscription | null;
  allTags: string[];
}

function SubscriptionDialog({
  open,
  onClose,
  onSave,
  initial,
  allTags,
}: SubscriptionDialogProps) {
  const [form, setForm] = useState<SubscriptionFormData>({ ...emptyForm });

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              serviceName: initial.serviceName,
              dueDate: initial.dueDate,
              amount: String(initial.amount),
              period: initial.period,
              tags: [...initial.tags],
              note: initial.note,
              active: initial.active,
            }
          : { ...emptyForm }
      );
    }
  }, [open, initial]);

  const handleChange = (field: keyof SubscriptionFormData, value: unknown) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.serviceName.trim() || !form.dueDate) return;
    onSave({ ...form });
    onClose();
  };

  const isValid = form.serviceName.trim() !== '' && form.dueDate !== '';

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initial ? 'Edit Subscription' : 'Add Subscription'}
      submitLabel={initial ? 'Save' : 'Add'}
      submitDisabled={!isValid}
    >
      <TextField
        label="Service Name"
        required
        value={form.serviceName}
        onChange={(e) => handleChange('serviceName', e.target.value)}
      />
      <TextField
        label="Due Date"
        type="date"
        required
        value={form.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <CurrencyField
        label="Amount"
        value={form.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel>Period</InputLabel>
        <Select
          value={form.period}
          label="Period"
          onChange={(e) => handleChange('period', e.target.value as Period)}
        >
          {PERIOD_OPTIONS.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TagsAutocomplete
        options={allTags}
        value={form.tags}
        onChange={(_, v) =>
          handleChange(
            'tags',
            v
              .map((x) => (typeof x === 'string' ? x.trim() : ''))
              .filter(Boolean)
          )
        }
      />
      <TextField
        label="Note"
        value={form.note}
        onChange={(e) => handleChange('note', e.target.value)}
        multiline
        rows={2}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={form.active}
            onChange={(e) => handleChange('active', e.target.checked)}
          />
        }
        label="Active"
      />
    </FormDialog>
  );
}

export default function SubscriptionsManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [columnVisibility, setColumnVisibilityState] = useState<ColumnVisibility>({
    no: true,
    serviceName: true,
    dueDate: true,
    amount: true,
    period: true,
    tags: true,
    note: true,
    active: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterServiceName, setFilterServiceName] = useState<string>('');
  const [filterExpiry, setFilterExpiry] = useState<ExpiryFilter>('all');
  const [filterActive, setFilterActive] = useState(true);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterNote, setFilterNote] = useState('');

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, visibility] = await Promise.all([
        getAllSubscriptions(),
        getColumnVisibility(),
      ]);
      setSubscriptions(subs);
      setColumnVisibilityState(visibility);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setColumnVisibility = useCallback(
    async (v: ColumnVisibility) => {
      setColumnVisibilityState(v);
      await saveColumnVisibility(v);
    },
    []
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    subscriptions.forEach((s) => s.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [subscriptions]);

  const serviceNames = useMemo(() => {
    const set = new Set(subscriptions.map((s) => s.serviceName));
    return Array.from(set).sort();
  }, [subscriptions]);

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      if (filterServiceName && s.serviceName !== filterServiceName) return false;
      if (filterActive && !s.active) return false;
      if (filterNote && !s.note.toLowerCase().includes(filterNote.toLowerCase())) return false;
      if (filterTags.length > 0) {
        const hasAny = filterTags.some((t) => s.tags.includes(t));
        if (!hasAny) return false;
      }
      if (filterExpiry === 'expired_only' && !isExpired(s.dueDate)) return false;
      if (filterExpiry === 'expires_in_week' && !expiresInWeek(s.dueDate)) return false;
      return true;
    });
  }, [
    subscriptions,
    filterServiceName,
    filterExpiry,
    filterActive,
    filterTags,
    filterNote,
  ]);

  const handleAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (s: Subscription) => {
    setEditing(s);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this subscription?')) {
      const success = await deleteSubscription(id);
      if (success) {
        await loadData();
      } else {
        alert('Failed to delete subscription');
      }
    }
  };

  const handleSave = async (data: SubscriptionFormData) => {
    const amount = parseFloat(data.amount) || 0;
    const subscription: Subscription = {
      id: editing?.id || crypto.randomUUID(),
      serviceName: data.serviceName.trim(),
      dueDate: data.dueDate,
      amount,
      period: data.period,
      tags: data.tags,
      note: data.note,
      active: data.active,
    };

    const success = editing
      ? await updateSubscription(subscription)
      : await createSubscription(subscription);

    if (success) {
      await loadData();
      setEditing(null);
      setDialogOpen(false);
    } else {
      alert('Failed to save subscription');
    }
  };

  const toggleColumn = async (key: string) => {
    const next = {
      ...columnVisibility,
      [key]: !columnVisibility[key as keyof ColumnVisibility],
    };
    await setColumnVisibility(next);
  };

  if (loading) {
    return (
      <ScreenLayout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Loading...</Typography>
        </Box>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Subscriptions Manager"
          backPath="/home"
          actions={
            <GradientButton startIcon={<AddIcon />} onClick={handleAdd}>
              Add subscription
            </GradientButton>
          }
        />

        {/* Filters */}
        <Paper
          sx={{
            p: 2,
            mb: 2,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
            Search Filters
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Service Name</InputLabel>
              <Select
                value={filterServiceName}
                label="Service Name"
                onChange={(e: SelectChangeEvent<string>) => setFilterServiceName(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {serviceNames.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterActive}
                  onChange={(e) => setFilterActive(e.target.checked)}
                />
              }
              label="Active"
              sx={{ color: 'rgba(255,255,255,0.8)' }}
            />
            <TagsAutocomplete
              options={allTags}
              value={filterTags}
              onChange={(_, v) => setFilterTags(v)}
              size="small"
              sx={{ minWidth: 200 }}
            />
            <TextField
              size="small"
              label="Note"
              value={filterNote}
              onChange={(e) => setFilterNote(e.target.value)}
              sx={{ minWidth: 180 }}
            />
          </Box>
        </Paper>

        {/* Toolbar: Column visibility */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <ColumnVisibilityMenu
            columns={COLUMN_LABELS}
            visibility={columnVisibility}
            onToggle={toggleColumn}
          />
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                {columnVisibility.no && <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>No</TableCell>}
                {columnVisibility.serviceName && (
                  <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>Service Name</TableCell>
                )}
                {columnVisibility.dueDate && (
                  <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>Due Date</TableCell>
                )}
                {columnVisibility.amount && (
                  <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>Amount</TableCell>
                )}
                {columnVisibility.period && (
                  <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>Period</TableCell>
                )}
                {columnVisibility.tags && (
                  <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>Tags</TableCell>
                )}
                {columnVisibility.note && (
                  <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>Note</TableCell>
                )}
                {columnVisibility.active && (
                  <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>Active</TableCell>
                )}
                <TableCell sx={{ color: 'rgba(255,255,255,0.9)', width: 100 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                    No subscriptions found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s, i) => (
                  <TableRow key={s.id} hover>
                    {columnVisibility.no && (
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{i + 1}</TableCell>
                    )}
                    {columnVisibility.serviceName && (
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{s.serviceName}</TableCell>
                    )}
                    {columnVisibility.dueDate && (
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{s.dueDate}</TableCell>
                    )}
                    {columnVisibility.amount && (
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {formatCurrency(s.amount)}
                      </TableCell>
                    )}
                    {columnVisibility.period && (
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{s.period}</TableCell>
                    )}
                    {columnVisibility.tags && (
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {s.tags.map((t) => (
                            <Chip key={t} label={t} size="small" />
                          ))}
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.note && (
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{s.note}</TableCell>
                    )}
                    {columnVisibility.active && (
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {s.active ? 'Yes' : 'No'}
                      </TableCell>
                    )}
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEdit(s)} sx={{ color: '#a78bfa' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(s.id)} sx={{ color: '#f87171' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <SubscriptionDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
          initial={editing}
          allTags={allTags}
        />
      </Box>
    </ScreenLayout>
  );
}
