import React from 'react';
import { Box, Typography, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- 1. Importiamo il contesto

const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

export  function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); 

  const adminBlocks = [
    { label: 'GESTIONE\nARTISTA', color: '#ff667c', path: '/admin/artista' },
    { label: 'GESTIONE\nALBUM', color: '#16b5ea', path: '/admin/album' },
    { label: 'GESTIONE\nBRANO', color: '#00e124', path: '/admin/brano' },
    { label: 'PAGINA\nPROFILO', color: '#fcf338', path: '/profilo' },
  ];

  if (!isAdmin) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '4vw',
          backgroundColor: 'transparent'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: '"Inria Serif", serif', 
            fontWeight: 700, 
            color: '#ff667c', 
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)', 
            padding: '4vh 4vw',
            borderRadius: '16px',
            border: '1px solid rgba(255,102,124,0.3)'
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
        padding: '6vh 2vw', 
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {}
      <Box sx={{ mb: '6vh', pl: '1vw' }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontFamily: '"Inria Serif", serif',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '1px',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          Pannello Admin
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: '"Inria Serif", serif',
            fontWeight: 400,
            color: '#e0e0e0',
            mt: '1vh',
            fontSize: { xs: '1rem', md: '1.2rem' },
          }}
        >
          Sezione strumenti riservata agli amministratori del sito
        </Typography>
      </Box>

      {}
      <Box 
        sx={{
          width: { xs: '100%', sm: '90%', md: '75%', lg: '65%' }, 
          margin: '0 auto', 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
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
              backgroundImage: noisePattern,
              backgroundBlendMode: 'overlay',
              padding: '8vh 2vw', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'filter 0.2s',
              '&:hover': {
                filter: 'brightness(0.9)', 
              }
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Inria Serif", serif',
                fontWeight: 700,
                color: '#1a1a1a', 
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                textAlign: 'center',
                whiteSpace: 'pre-line', 
                lineHeight: 1.3,
                letterSpacing: '1px',
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