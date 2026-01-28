import { Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface GradientButtonProps extends ButtonProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export default function GradientButton({
  children,
  sx,
  ...props
}: GradientButtonProps) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
        '&:hover': {
          background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)',
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
