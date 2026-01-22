import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField } from '@mui/material';
import {
  ScreenLayout,
  GlassCard,
  LogoText,
  PasswordField,
  GradientButton,
} from '../components';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigate('/home');
  };

  return (
    <ScreenLayout centered>
      <GlassCard
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <LogoText />

        <PasswordField
          fullWidth
          label="Master Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          sx={{ mb: 3 }}
        />

        <GradientButton fullWidth size="large" onClick={handleLogin} sx={{ py: 1.5, fontWeight: 600 }}>
          Login
        </GradientButton>
      </GlassCard>
    </ScreenLayout>
  );
}
