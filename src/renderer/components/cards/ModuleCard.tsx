import {
  Card,
  CardContent,
  CardActionArea,
  Box,
  Typography,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: SvgIconComponent;
  onClick: () => void;
}

export default function ModuleCard({
  title,
  description,
  icon: Icon,
  onClick,
}: ModuleCardProps) {
  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': {
          background: 'rgba(255,255,255,0.08)',
          borderColor: 'rgba(124, 58, 237, 0.5)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 2 }}>
        <CardContent>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Icon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600, mb: 1 }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
