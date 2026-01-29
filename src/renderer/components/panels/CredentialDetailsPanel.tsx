import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Credential } from '../../../types';

interface CredentialDetailsPanelProps {
  open: boolean;
  onClose: () => void;
  credential: Credential | null;
}

export default function CredentialDetailsPanel({
  open,
  onClose,
  credential,
}: CredentialDetailsPanelProps) {
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [visibleCustomFields, setVisibleCustomFields] = useState<Set<number>>(
    new Set(),
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleCustomFieldVisibility = (index: number) => {
    setVisibleCustomFields((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (!credential) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.95)' }}>
            Credential Details
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.8)' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}
            >
              Service Name
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {credential.serviceName}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          <Box>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}
            >
              Username
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', flex: 1 }}>
                {showUsername ? credential.username : '•'.repeat(20)}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setShowUsername(!showUsername)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {showUsername ? <VisibilityOff /> : <Visibility />}
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleCopy(credential.username)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          <Box>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}
            >
              Password
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', flex: 1 }}>
                {showPassword ? credential.password : '•'.repeat(20)}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setShowPassword(!showPassword)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleCopy(credential.password)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </Box>

          {credential.customFields && credential.customFields.length > 0 && (
            <>
              {credential.customFields.map((field, index) => (
                <Box key={index}>
                  <Divider
                    sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }}
                  />

                  <Typography
                    variant="caption"
                    sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5 }}
                  >
                    {field.key || `Field ${index + 1}`}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      sx={{ color: 'rgba(255,255,255,0.9)', flex: 1 }}
                    >
                      {visibleCustomFields.has(index)
                        ? field.value
                        : '•'.repeat(20)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => toggleCustomFieldVisibility(index)}
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {visibleCustomFields.has(index) ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                    {field.value && (
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(field.value)}
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </>
          )}

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          <Box>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}
            >
              Note
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {credential.note || 'No note'}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          <Box>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}
            >
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {credential.tags.length > 0 ? (
                credential.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  No tags
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
