import { Typography, TypographyProps } from '@mui/material';

interface LogoTextProps extends Omit<TypographyProps, 'children'> {
  text?: string;
}

export default function LogoText({ text = 'PRIVAULT', ...props }: LogoTextProps) {
  return (
    <Typography
      variant="h4"
      component="h1"
      sx={{
        fontWeight: 700,
        textAlign: 'center',
        mb: 3,
        letterSpacing: 4,
        background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        ...props.sx,
      }}
      {...props}
    >
      {text}
    </Typography>
  );
}
