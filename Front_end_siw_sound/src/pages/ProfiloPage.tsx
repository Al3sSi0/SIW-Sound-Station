import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Avatar, Chip, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import SecurityIcon from '@mui/icons-material/Security';
import LogoutIcon from '@mui/icons-material/Logout';

export function ProfiloPage() {
  const [profilo, setProfilo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { logout } = useAuth(); 

  useEffect(() => {
    async function fetchProfiloUtente() {
      try {
        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const dati = await response.json();
            setProfilo(dati);
          } else {
            setError("Risposta del server malformata.");
          }
        } else if (response.status === 404) {
          setError("Profilo non trovato.");
        } else if (response.status === 401) {
          setError("Sessione scaduta. Effettua nuovamente il login.");
        } else {
          setError("Errore durante il caricamento del profilo.");
        }
      } catch (err) {
        console.error(err);
        setError("Errore di rete, connessione fallita.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfiloUtente();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error || !profilo) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '4vh 4vw',
        boxSizing: 'border-box',
        textAlign: 'center',
        mt: '15vh'
      }}>
        <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', color: '#d4efe2', mb: '4vh', fontWeight: 700, letterSpacing: '1px' }}>
          {error || "Si è verificato un errore."}
        </Typography>
        
        {}
        {error?.includes("scaduta") && (
          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={() => { logout(); navigate('/'); }}
            sx={{
              backgroundColor: '#1a1a1a',
              color: '#ff667c',
              borderRadius: '16px',
              padding: '14px 32px',
              fontFamily: '"Inria Serif", serif',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              '&:hover': { 
                backgroundColor: '#c0392b', 
                color: '#ffffff',
                transform: 'translateY(-2px)' 
              },
              transition: 'all 0.2s ease'
            }}
          >
            Sblocca Sessione & Torna alla Home
          </Button>
        )}
      </Box>
    );
  }

  const utenteAnagrafica = profilo.user || {};
  const numeroPlaylist = utenteAnagrafica.playlists ? utenteAnagrafica.playlists.length : 0;
  const iniziali = `${utenteAnagrafica.name?.[0] || ''}${utenteAnagrafica.surname?.[0] || ''}`.toUpperCase();
  const isAdmin = profilo.role === 'ADMIN';

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        overflowY: 'auto',
        padding: '4vh 4vw 6vh 4vw', 
        boxSizing: 'border-box' 
      }}
    >
      {}
      <Box sx={{ mb: '5vh', pl: '1vw' }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontFamily: '"Inria Serif", serif',
            fontWeight: 700,
            color: '#d4efe2',
            letterSpacing: '3px',
            fontSize: { xs: '3rem', md: '3.5rem' },
          }}
        >
          IL TUO PROFILO
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: '"Inria Serif", serif',
            fontWeight: 400,
            color: '#d4efe2',
            opacity: 0.9,
            mt: '1vh',
            fontSize: '1.2rem',
          }}
        >
          Visualizza i dettagli del tuo account e le tue statistiche su Station.
        </Typography>
      </Box>

      {}
      <Paper 
        elevation={0} 
        sx={{ 
          width: '100%', 
          maxWidth: '100%', 
          borderRadius: '50px', 
          overflow: 'hidden', 
          background: 'linear-gradient(135deg, #4b5851 30%, #84a293 100%)', 
          border: '1px solid rgba(255,255,255,0.1)',
          padding: { xs: '4vh 4vw', sm: '6vh 5vw' },
          boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
          boxSizing: 'border-box'
        }}
      >
        {}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: '5vh' }}>
          <Avatar sx={{ 
            width: '120px', height: '120px', fontSize: '2.5rem', fontWeight: 700, 
            backgroundColor: '#1a1a1a', color: '#fff', mb: 2, boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            fontFamily: '"Inria Serif", serif'
          }}>
            {iniziali || 'U'}
          </Avatar>
          
          <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', mb: 1.5 }}>
            {utenteAnagrafica.name} {utenteAnagrafica.surname}
          </Typography>

          <Chip 
            icon={<SecurityIcon style={{ color: '#fff', fontSize: '1.1rem' }} />}
            label={isAdmin ? "Amministratore" : "Utente Standard"} 
            sx={{ 
              backgroundColor: isAdmin ? '#b91c1c' : '#1a1a1a', 
              color: '#fff', fontWeight: 600, fontFamily: '"Inria Serif", serif',
              padding: '4px 8px', fontSize: '0.9rem', borderRadius: '12px'
            }} 
          />
        </Box>

        <Divider sx={{ mb: '5vh', backgroundColor: 'rgba(255,255,255,0.15)' }} />

        {}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
          gap: '4vh 4vw',
          alignItems: 'center'
        }}>
          
          {}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountCircleIcon sx={{ color: '#d4efe2', fontSize: '2.2rem' }} />
            <Box>
              <Typography variant="caption" sx={{ fontFamily: '"Inria Serif", serif', color: '#d4efe2', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Username 
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', mt: 0.2 }}>
                {profilo.username}
              </Typography>
            </Box>
          </Box>

          {}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EmailIcon sx={{ color: '#d4efe2', fontSize: '2.2rem' }} />
            <Box>
              <Typography variant="caption" sx={{ fontFamily: '"Inria Serif", serif', color: '#d4efe2', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Indirizzo Email
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', mt: 0.2, wordBreak: 'break-all' }}>
                {utenteAnagrafica.email}
              </Typography>
            </Box>
          </Box>

          {}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <QueueMusicIcon sx={{ color: '#d4efe2', fontSize: '2.2rem' }} />
            <Box>
              <Typography variant="caption" sx={{ fontFamily: '"Inria Serif", serif', color: '#d4efe2', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Playlist create da te
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', mt: 0.2 }}>
                {numeroPlaylist} {numeroPlaylist === 1 ? 'playlist' : 'playlist'}
              </Typography>
            </Box>
          </Box>

          {}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, width: '100%' }}>
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={() => { logout(); navigate('/'); }}
              sx={{
                backgroundColor: '#1a1a1a',
                color: '#ff667c', 
                borderRadius: '16px',
                padding: '12px 28px',
                fontFamily: '"Inria Serif", serif',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                '&:hover': { 
                  backgroundColor: '#c0392b', 
                  color: '#ffffff',
                  transform: 'translateY(-2px)' 
                },
                transition: 'all 0.2s ease'
              }}
            >
              Esci
            </Button>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
}