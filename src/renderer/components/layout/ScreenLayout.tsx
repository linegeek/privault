import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface ScreenLayoutProps {
  children: ReactNode;
  centered?: boolean;
}

export default function ScreenLayout({ children, centered = false }: ScreenLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
        ...(centered && {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }),
      }}
    >
      {children}
    </Box>
  );
}
