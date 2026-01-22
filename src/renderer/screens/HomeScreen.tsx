import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import { Subscriptions as SubscriptionsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { ScreenLayout, ModuleCard } from '../components';
import { useAuth } from '../contexts/AuthContext';

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
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScreenLayout>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: 2,
            }}
          >
            Dashboard
          </Typography>
          <IconButton onClick={handleLogout} sx={{ color: 'rgba(255,255,255,0.8)' }} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Box>

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
