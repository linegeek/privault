import { Box, IconButton, Typography } from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';

interface MaskedFieldWithActionsProps {
  value: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onCopy: () => void;
  maskLength?: number;
}

export default function MaskedFieldWithActions({
  value,
  isVisible,
  onToggleVisibility,
  onCopy,
  maskLength = 20,
}: MaskedFieldWithActionsProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        '& .action-buttons': {
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
        },
        '&:hover .action-buttons': { opacity: 1 },
      }}
    >
      <Typography>
        {isVisible ? value : '\u2022'.repeat(maskLength)}
      </Typography>
      <Box
        className="action-buttons"
        sx={{
          position: 'absolute',
          left: -10,
          top: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          px: 1,
          backdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleVisibility();
          }}
          sx={{ color: 'rgba(255,255,255,0.9)' }}
        >
          {isVisible ? <VisibilityOff /> : <Visibility />}
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCopy();
          }}
          sx={{ color: 'rgba(255,255,255,0.9)' }}
        >
          <ContentCopyIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

