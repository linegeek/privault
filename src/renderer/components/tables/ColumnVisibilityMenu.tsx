import { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import { ViewColumn as ViewColumnIcon } from '@mui/icons-material';

interface ColumnVisibilityMenuProps {
  columns: Record<string, string>; // key -> label mapping
  visibility: Record<string, boolean>;
  onToggle: (key: string) => void;
  buttonText?: string;
}

export default function ColumnVisibilityMenu({
  columns,
  visibility,
  onToggle,
  buttonText = 'Column visibility',
}: ColumnVisibilityMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Button
        startIcon={<ViewColumnIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ color: 'rgba(255,255,255,0.8)' }}
      >
        {buttonText}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {Object.entries(columns).map(([key, label]) => (
          <MenuItem
            key={key}
            onClick={() => {
              onToggle(key);
            }}
          >
            <ListItemIcon>
              <Checkbox checked={visibility[key] ?? true} disableRipple />
            </ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
