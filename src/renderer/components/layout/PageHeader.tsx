import { ReactNode } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  backPath?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, onBack, backPath, actions }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backPath) {
      navigate(backPath);
    } else {
      navigate('/home');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <IconButton onClick={handleBack} sx={{ color: 'rgba(255,255,255,0.8)' }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600, flex: 1 }}>
        {title}
      </Typography>
      {actions && <Box>{actions}</Box>}
    </Box>
  );
}
