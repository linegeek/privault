import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  IconButton,
  Chip,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  getAllCredentials,
  createCredential,
  updateCredential,
  deleteCredential,
} from '../services';
import {
  ScreenLayout,
  PageHeader,
  GradientButton,
  ColumnVisibilityMenu,
  CredentialDialog,
  CredentialFiltersDialog,
  CredentialDetailsPanel,
  CustomTable,
  MaskedFieldWithActions,
} from '../components';
import { containsIgnoreCase } from '../utils';
import { Credential, CredentialFormData, ColumnDefinition, RowAction } from '../../types';
import { useColumnVisibility } from '../hooks';
import {
  DEFAULT_VISIBLE_CREDENTIAL_COLUMNS,
  CREDENTIAL_COLUMN_LABELS,
  CREDENTIAL_COLUMN_VISIBILITY_STORAGE_KEY,
} from '../constants';

export default function CredentialsManager() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const { columnVisibility, toggleColumn } = useColumnVisibility(
    CREDENTIAL_COLUMN_VISIBILITY_STORAGE_KEY,
    DEFAULT_VISIBLE_CREDENTIAL_COLUMNS,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] =
    useState<Credential | null>(null);

  // Filters
  const [filterServiceName, setFilterServiceName] = useState<string>('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterNote, setFilterNote] = useState('');

  // Visibility toggles for email/password in table
  const [visibleEmails, setVisibleEmails] = useState<Set<string>>(new Set());
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set(),
  );

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const creds = await getAllCredentials();
      setCredentials(creds);
    } catch {
      // Error handled silently - could add user notification here
    } finally {
      setLoading(false);
    }
  };

  const allTags = useMemo(() => {
    const set = new Set<string>();
    credentials.forEach((c) => c.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [credentials]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterServiceName) count++;
    if (filterTags.length > 0) count++;
    if (filterNote) count++;
    return count;
  }, [filterServiceName, filterTags, filterNote]);

  const filteredCredentials = useMemo(() => {
    return credentials.filter((c) => {
      if (
        filterServiceName &&
        !containsIgnoreCase(c.serviceName, filterServiceName)
      ) {
        return false;
      }
      if (filterNote && !containsIgnoreCase(c.note, filterNote)) {
        return false;
      }
      if (filterTags.length > 0) {
        const hasAny = filterTags.some((t) => c.tags.includes(t));
        if (!hasAny) {
          return false;
        }
      }
      return true;
    });
  }, [credentials, filterServiceName, filterTags, filterNote]);

  const handleAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (credential: Credential) => {
    setEditing(credential);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      const success = await deleteCredential(id);
      if (success) {
        await loadData();
      } else {
        alert('Failed to delete credential');
      }
    }
  };

  const handleSave = async (data: CredentialFormData) => {
    const credential: Credential = {
      id: editing?.id || crypto.randomUUID(),
      serviceName: data.serviceName.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
      tags: data.tags,
      note: data.note,
    };

    const success = editing
      ? await updateCredential(credential)
      : await createCredential(credential);

    if (success) {
      await loadData();
      setEditing(null);
      setDialogOpen(false);
    } else {
      alert('Failed to save credential');
    }
  };

  const handleShowDetails = (credential: Credential) => {
    setSelectedCredential(credential);
    setDetailsPanelOpen(true);
  };

  const toggleEmailVisibility = (id: string) => {
    setVisibleEmails((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const columns: ColumnDefinition<Credential>[] = useMemo(
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
        key: 'email',
        label: 'Email',
        visible: columnVisibility.email,
        render: (_value, row) => (
          <MaskedFieldWithActions
            value={row.email}
            isVisible={visibleEmails.has(row.id)}
            onToggleVisibility={() => toggleEmailVisibility(row.id)}
            onCopy={() => handleCopy(row.email)}
          />
        ),
      },
      {
        key: 'password',
        label: 'Password',
        visible: columnVisibility.password,
        render: (_value, row) => (
          <MaskedFieldWithActions
            value={row.password}
            isVisible={visiblePasswords.has(row.id)}
            onToggleVisibility={() => togglePasswordVisibility(row.id)}
            onCopy={() => handleCopy(row.password)}
          />
        ),
      },
      {
        key: 'tags',
        label: 'Tags',
        visible: columnVisibility.tags,
        render: (value) => (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {(value as string[]).map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        ),
      },
      {
        key: 'note',
        label: 'Note',
        visible: columnVisibility.note,
      },
    ],
    [columnVisibility, visibleEmails, visiblePasswords],
  );

  const rowActions: RowAction<Credential>[] = useMemo(
    () => [
      {
        icon: InfoIcon,
        onClick: handleShowDetails,
        color: '#60a5fa',
        title: 'Details',
      },
    ],
    [],
  );

  return (
    <ScreenLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Credentials Manager"
          backPath="/home"
          actions={
            <GradientButton startIcon={<AddIcon />} onClick={handleAdd}>
              Add credential
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
            columns={CREDENTIAL_COLUMN_LABELS}
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
        <CustomTable<Credential>
          columns={columns}
          data={filteredCredentials}
          loading={loading}
          emptyMessage="No credentials found"
          onEdit={handleEdit}
          onDelete={(row) => handleDelete(row.id)}
          rowActions={rowActions}
          getRowKey={(row) => row.id}
        />
      </Box>

      <CredentialDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initial={editing}
        allTags={allTags}
      />

      <CredentialFiltersDialog
        open={filtersDialogOpen}
        onClose={() => setFiltersDialogOpen(false)}
        filterServiceName={filterServiceName}
        setFilterServiceName={setFilterServiceName}
        filterTags={filterTags}
        setFilterTags={setFilterTags}
        filterNote={filterNote}
        setFilterNote={setFilterNote}
        allTags={allTags}
      />

      <CredentialDetailsPanel
        open={detailsPanelOpen}
        onClose={() => setDetailsPanelOpen(false)}
        credential={selectedCredential}
      />
    </ScreenLayout>
  );
}
