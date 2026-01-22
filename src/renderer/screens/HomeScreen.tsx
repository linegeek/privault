import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Subscriptions as SubscriptionsIcon } from '@mui/icons-material';
import { ScreenLayout, ModuleCard } from '../components';

const MODULES = [
  {
    id: 'subscriptions',
    title: 'Subscriptions Manager',
    description: 'Manage your subscriptions, due dates, and billing cycles.',
    path: '/subscriptions',
    icon: SubscriptionsIcon,
  },
  // Add more modules here as the app grows
];

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <ScreenLayout>
      <Box sx={{ p: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: 2,
          }}
        >
          Dashboard
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 3,
          }}
        >
          {MODULES.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              onClick={() => navigate(module.path)}
            />
          ))}
        </Box>
      </Box>
    </ScreenLayout>
  );
}
