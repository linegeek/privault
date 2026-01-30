import { useState, useMemo, useEffect } from 'react';
import { Box, Chip, Badge, IconButton } from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from '../services';
import {
  ScreenLayout,
  PageHeader,
  GradientButton,
  ColumnVisibilityMenu,
  SubscriptionDialog,
  SearchFiltersDialog,
  CustomTable,
} from '../components';
import {
  formatCurrency,
  isExpired,
  expiresInWeek,
  containsIgnoreCase,
} from '../utils';
import {
  ExpiryFilter,
  Subscription,
  SubscriptionFormData,
  ColumnDefinition,
} from '../../types';
import { useColumnVisibility } from '../hooks';
import {
  DEFAULT_VISIBILE_SUBSCRIPTION_COLUMNS,
  SUBSCRIPTION_COLUMN_LABELS,
  SUBSCRIPTION_COLUMN_VISIBILITY_STORAGE_KEY,
} from '../constants';

export default function SubscriptionsManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const { columnVisibility, toggleColumn } = useColumnVisibility(
    SUBSCRIPTION_COLUMN_VISIBILITY_STORAGE_KEY,
    DEFAULT_VISIBILE_SUBSCRIPTION_COLUMNS,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);

  // Filters
  const [filterServiceName, setFilterServiceName] = useState<string>('');
  const [filterExpiry, setFilterExpiry] =
    useState<ExpiryFilter>('expires_in_week');
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
      const subscriptions = await getAllSubscriptions();
      setSubscriptions(subscriptions);
    } catch {
      // Error handled silently - could add user notification here
    } finally {
      setLoading(false);
    }
  };

  const allTags = useMemo(() => {
    const set = new Set<string>();
    subscriptions.forEach((s) => s.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [subscriptions]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterServiceName) count++;
    if (filterExpiry !== 'all') count++;
    if (!filterActive) count++; // true is the default
    if (filterTags.length > 0) count++;
    if (filterNote) count++;
    return count;
  }, [filterServiceName, filterExpiry, filterActive, filterTags, filterNote]);

  const renderedSubscriptions = useMemo(() => {
    const sortedSubscriptions = subscriptions.slice().sort((a, b) => {
      const ats = new Date(a.dueDate).getTime();
      const bts = new Date(b.dueDate).getTime();
      return ats - bts;
    });

    return sortedSubscriptions.filter((s) => {
      if (
        filterServiceName &&
        !containsIgnoreCase(s.serviceName, filterServiceName)
      ) {
        return false;
      }
      if (filterActive && !s.active) {
        return false;
      }
      if (filterNote && !containsIgnoreCase(s.note, filterNote)) {
        return false;
      }
      if (filterTags.length > 0) {
        const hasAll = filterTags.some((t) => s.tags.includes(t));
        if (!hasAll) {
          return false;
        }
      }
      if (filterExpiry === 'expired_only' && !isExpired(s.dueDate)) {
        return false;
      }
      if (filterExpiry === 'expires_in_week' && !expiresInWeek(s.dueDate)) {
        return false;
      }
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

  const columns: ColumnDefinition<Subscription>[] = useMemo(
    () => [
      {
        key: 'no',
        label: 'No',
        visible: columnVisibility.no,
        render: (_value, _row, index) => (index !== undefined ? index + 1 : ''),
      },
      {
        key: 'serviceName',
        label: 'Service Name',
        visible: columnVisibility.serviceName,
      },
      {
        key: 'dueDate',
        label: 'Due Date',
        visible: columnVisibility.dueDate,
      },
      {
        key: 'amount',
        label: 'Amount',
        visible: columnVisibility.amount,
        render: (value) => formatCurrency(value as number),
      },
      {
        key: 'period',
        label: 'Period',
        visible: columnVisibility.period,
      },
      {
        key: 'tags',
        label: 'Tags',
        visible: columnVisibility.tags,
        render: (value) => (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {(value as string[]).map((t) => (
              <Chip key={t} label={t} size="small" />
            ))}
          </Box>
        ),
      },
      {
        key: 'note',
        label: 'Note',
        visible: columnVisibility.note,
      },
      {
        key: 'active',
        label: 'Active',
        visible: columnVisibility.active,
        render: (value) => (value ? 'Yes' : 'No'),
      },
    ],
    [columnVisibility],
  );

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

        {/* Toolbar: Filter and Column visibility buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 2,
            gap: 1,
          }}
        >
          <ColumnVisibilityMenu
            columns={SUBSCRIPTION_COLUMN_LABELS}
            visibility={columnVisibility}
            onToggle={toggleColumn}
          />
          <Badge
            badgeContent={activeFiltersCount}
            color="primary"
            invisible={activeFiltersCount === 0}
          >
            <IconButton
              onClick={() => setFiltersDialogOpen(true)}
              sx={{ color: 'rgba(255,255,255,0.8)' }}
              title="Search Filters"
            >
              <FilterListIcon />
            </IconButton>
          </Badge>
        </Box>

        {/* Table */}
        <CustomTable<Subscription>
          columns={columns}
          data={renderedSubscriptions}
          loading={loading}
          emptyMessage="No subscriptions found"
          onEdit={handleEdit}
          onDelete={(row) => handleDelete(row.id)}
          getRowKey={(row) => row.id}
          rowsPerPageOptions={[10, 25, 50, 100]}
          defaultRowsPerPage={10}
          storageKey="subscriptions-table"
        />

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

        <SearchFiltersDialog
          open={filtersDialogOpen}
          onClose={() => setFiltersDialogOpen(false)}
          filterServiceName={filterServiceName}
          setFilterServiceName={setFilterServiceName}
          filterExpiry={filterExpiry}
          setFilterExpiry={setFilterExpiry}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          filterNote={filterNote}
          setFilterNote={setFilterNote}
          allTags={allTags}
        />
      </Box>
    </ScreenLayout>
  );
}
