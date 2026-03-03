import { ReactNode, useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TablePagination,
  Box,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ColumnDefinition, RowAction } from '../../../types';

interface CustomTableProps<T = unknown> {
  columns: ColumnDefinition<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  rowActions?: RowAction<T>[];
  getRowKey?: (row: T, index: number) => string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  storageKey?: string;
  onRowClick?: (row: T) => void;
}

export default function CustomTable<T = unknown>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  onEdit,
  onDelete,
  rowActions,
  getRowKey,
  rowsPerPageOptions = [10, 25, 50, 100],
  defaultRowsPerPage = 10,
  storageKey,
  onRowClick,
}: CustomTableProps<T>) {
  const visibleColumns = columns.filter((col) => col.visible);
  const hasActions = onEdit || onDelete || (rowActions && rowActions.length > 0);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (storageKey) {
      const stored = localStorage.getItem(`${storageKey}-rows-per-page`);
      return stored ? parseInt(stored, 10) : defaultRowsPerPage;
    }
    return defaultRowsPerPage;
  });

  // Reset page when data changes
  useEffect(() => {
    setPage(0);
  }, [data.length]);

  // Persist rows per page
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`${storageKey}-rows-per-page`, String(rowsPerPage));
    }
  }, [rowsPerPage, storageKey]);

  // Paginate data
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const defaultActions: RowAction<T>[] = [];
  if (onEdit) {
    defaultActions.push({
      icon: EditIcon,
      onClick: onEdit,
      color: '#a78bfa',
      title: 'Edit',
    });
  }
  if (onDelete) {
    defaultActions.push({
      icon: DeleteIcon,
      onClick: onDelete,
      color: '#f87171',
      title: 'Delete',
    });
  }

  const allActions = [...defaultActions, ...(rowActions || [])];

  if (loading) {
    return (
      <TableContainer
        component={Paper}
        sx={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          maxHeight: 'calc(100vh - 168px)',
          overflow: 'auto',
        }}
      >
        <Typography sx={{ p: 3, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
          Loading...
        </Typography>
      </TableContainer>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        maxHeight: 'calc(100vh - 168px)',
        overflow: 'auto',
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {visibleColumns.map((col) => (
              <TableCell
                key={col.key}
                align={col.align}
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  ...(col.width && { width: col.width }),
                  ...(col.sx || {}),
                }}
              >
                {col.label}
              </TableCell>
            ))}
            {hasActions && (
              <TableCell
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  width: 150,
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length + (hasActions ? 1 : 0)}
                sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, paginatedIndex) => {
              const actualIndex = page * rowsPerPage + paginatedIndex;
              const rowKey = getRowKey ? getRowKey(row, actualIndex) : String(actualIndex);
              return (
                <TableRow
                  key={rowKey}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {visibleColumns.map((col) => {
                    const value = (row as Record<string, unknown>)[col.key];
                    const content = col.render ? col.render(value, row, actualIndex) : value;
                    return (
                      <TableCell
                        key={col.key}
                        align={col.align}
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
                          ...(col.width && { width: col.width }),
                          ...(col.sx || {}),
                        }}
                      >
                        {content as ReactNode}
                      </TableCell>
                    );
                  })}
                  {hasActions && (
                    <TableCell>
                      {allActions.map((action, actionIndex) => {
                        const ActionIcon = action.icon;
                        return (
                          <IconButton
                            key={actionIndex}
                            size="small"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            sx={{ color: action.color || 'rgba(255,255,255,0.8)' }}
                            title={action.title}
                          >
                            <ActionIcon fontSize="small" />
                          </IconButton>
                        );
                      })}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: 'rgba(255,255,255,0.8)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          '.MuiTablePagination-select': {
            color: 'rgba(255,255,255,0.8)',
          },
          '.MuiTablePagination-selectIcon': {
            color: 'rgba(255,255,255,0.8)',
          },
          '.MuiTablePagination-displayedRows': {
            color: 'rgba(255,255,255,0.8)',
          },
        }}
      />
    </TableContainer>
  );
}

