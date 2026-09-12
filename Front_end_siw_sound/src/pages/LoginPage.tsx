import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    const riscontro = await loginUser(username, password);
    
    if (riscontro) {

      const userRole = riscontro.role || 'DEFAULT';

      // Passiamo le 3 stringhe pulite al contesto: token, username e il ruolo ("ADMIN" o "DEFAULT")
      login(riscontro.token, riscontro.username, userRole);
      
      // Reindirizza alla Home/Lista Artisti dopo il successo
      navigate('/'); 
    } else {
      alert('Credenziali non valide su Postgres!');
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'transparent'
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: '85%', sm: '60%', md: '35%', lg: '28%' },
          padding: '4%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#222', marginBottom: '8%', textAlign: 'center' }}
        >
          SOUND STATION
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
              inputLabel: { style: { fontFamily: '"Inria Serif", serif' } },
              htmlInput: { style: { fontFamily: '"Inria Serif", serif' } }
            }}
            sx={{ marginBottom: '5%' }}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              inputLabel: { style: { fontFamily: '"Inria Serif", serif' } },
              htmlInput: { style: { fontFamily: '"Inria Serif", serif' } }
            }}
            sx={{ marginBottom: '8%' }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ padding: '3.5%', fontSize: '1.1rem', borderRadius: '8px', marginBottom: '6%' }}>
            Accedi
          </Button>

          <Box sx={{ textAlign: 'center', marginTop: '2%' }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigate('/register')}
              sx={{ fontFamily: '"Inria Serif", serif', color: '#444', textDecoration: 'underline', cursor: 'pointer', '&:hover': { color: '#000' } }}
            >
              Non hai un account? Registrati
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}