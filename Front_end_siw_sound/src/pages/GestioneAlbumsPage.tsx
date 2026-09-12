import React from 'react';
import { Box, Typography, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

export function GestioneAlbumsPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  
  const adminBlocks = [
    { label: 'INSERISCI ALBUM', color: '#b1e5ba', path: '/admin/album/new' },
    { label: 'MODIFICA ALBUM', color: '#d4efe2', path: '/admin/album/modifica' },
    { label: 'ELIMINA ALBUM', color: '#8cc0a7', path: '/admin/album/elimina' },
  ];

  if (!isAdmin) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4vw' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ff667c', textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)', padding: '4vh 4vw', borderRadius: '16px', border: '1px solid rgba(255,102,124,0.3)'
          }}
        >
          Questa pagina è riservata agli amministratori
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        overflowY: 'auto', 
        padding: '6vh 4vw', 
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {}
      <Box sx={{ mb: '6vh', pl: '1vw', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography
          onClick={() => navigate('/admin')}
          sx={{
            fontFamily: '"Inria Serif", serif',
            fontWeight: 400,
            color: '#e0e0e0',
            fontSize: '1rem',
            mb: '1vh',
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': { color: '#ffffff' }
          }}
        >
          ← Torna al Pannello Admin
        </Typography>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', letterSpacing: '1px', fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          Gestione Album
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#e0e0e0', mt: '1vh', fontSize: { xs: '1rem', md: '1.2rem' },
          }}
        >
          Seleziona l'operazione che desideri effettuare nel database
        </Typography>
      </Box>

      {}
      <Box 
        sx={{
          width: { xs: '100%', sm: '80%', md: '60%', lg: '50%' }, 
          margin: '0 auto', 
          padding:'5px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '32px',
          overflow: 'hidden', 
          boxShadow: '0 12px 32px rgba(0,0,0,0.4)', 
        }}
      >
        {adminBlocks.map((block, index) => (
          <CardActionArea
            key={index}
            onClick={() => navigate(block.path)}
            sx={{
              backgroundColor: block.color,
              padding: '6vh 2vw', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'filter 0.2s',
              '&:hover': { filter: 'brightness(0.9)' }
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Inria Serif", serif',
                fontWeight: 700,
                color: '#1a1a1a', 
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                textAlign: 'center',
                letterSpacing: '2px', 
              }}
            >
              {block.label}
            </Typography>
          </CardActionArea>
        ))}
      </Box>
    </Box>
  );
}