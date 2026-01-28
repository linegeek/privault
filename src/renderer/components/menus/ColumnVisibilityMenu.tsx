import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
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
}: ColumnVisibilityMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ color: 'rgba(255,255,255,0.8)' }}
        title="Column visibility"
      >
        <ViewColumnIcon />
      </IconButton>
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
              <Checkbox checked={visibility[key]} disableRipple />
            </ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
