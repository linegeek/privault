import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import {
  ScreenLayout,
  GlassCard,
  LogoText,
  PasswordField,
  GradientButton,
} from '../components';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await login(password);
      if (success) {
        navigate('/home');
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <PasswordField
          fullWidth
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleLogin()}
          disabled={loading}
          sx={{ mb: 3 }}
        />

        <GradientButton
          fullWidth
          size="large"
          onClick={handleLogin}
          disabled={loading}
          sx={{ py: 1.5, fontWeight: 600 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </GradientButton>
      </GlassCard>
    </ScreenLayout>
  );
}
