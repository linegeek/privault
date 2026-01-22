import { ReactNode } from 'react';
import { Paper, PaperProps } from '@mui/material';

interface GlassCardProps extends PaperProps {
  children: ReactNode;
}

export default function GlassCard({ children, sx, ...props }: GlassCardProps) {
  return (
    <Paper
      elevation={8}
      sx={{
        borderRadius: 3,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}
