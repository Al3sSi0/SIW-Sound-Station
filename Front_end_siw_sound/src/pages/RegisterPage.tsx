import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

export function RegisterPage() {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState(''); // <-- Nuovo Stato Email
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Invia tutti i dati reali a Spring Boot, inclusa l'email compilata
    const esito = await registerUser({ nome, cognome, email, username, password });
    if (esito) {
      alert('Utente registrato correttamente nel database!');
      navigate('/login');
    } else {
      alert('Errore durante la registrazione! Username o Email potrebbero essere già presenti.');
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper
        elevation={6}
        sx={{
          width: { xs: '85%', sm: '65%', md: '40%', lg: '32%' },
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
          sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#222', marginBottom: '6%', textAlign: 'center' }}
        >
          CREA ACCOUNT
        </Typography>

        <Box component="form" onSubmit={handleRegister} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: '4%', marginBottom: '4%' }}>
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              slotProps={{
                inputLabel: { style: { fontFamily: '"Inria Serif", serif' } },
                htmlInput: { style: { fontFamily: '"Inria Serif", serif' } }
              }}
            />
            <TextField
              label="Cognome"
              variant="outlined"
              fullWidth
              required
              value={cognome}
              onChange={(e) => setCognome(e.target.value)}
              slotProps={{
                inputLabel: { style: { fontFamily: '"Inria Serif", serif' } },
                htmlInput: { style: { fontFamily: '"Inria Serif", serif' } }
              }}
            />
          </Box>

          {/* Nuovo campo Email inserito in linea con il tuo design system di Figma */}
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{
              inputLabel: { style: { fontFamily: '"Inria Serif", serif' } },
              htmlInput: { style: { fontFamily: '"Inria Serif", serif' } }
            }}
            sx={{ marginBottom: '4%' }}
          />

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
            sx={{ marginBottom: '4%' }}
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
            sx={{ marginBottom: '6%' }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ padding: '3.5%', fontSize: '1.1rem', borderRadius: '8px', marginBottom: '5%' }}>
            Registrati
          </Button>

          <Box sx={{ textAlign: 'center', marginTop: '2%' }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigate('/login')}
              sx={{ fontFamily: '"Inria Serif", serif', color: '#444', textDecoration: 'underline', cursor: 'pointer', '&:hover': { color: '#000' } }}
            >
              Hai già un account? Accedi
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}