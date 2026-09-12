import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActionArea, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddIcon from '@mui/icons-material/Add'; 

export function PlaylistListPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function caricaMiePlaylists() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/playlists/mie', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
              const dati = await response.json();
              setPlaylists(dati);
          } else {
              const testoHtml = await response.text();
              console.log("--- SPIA HTML DEL SERVER ---");
              console.log(testoHtml.substring(0, 500)); 
              console.log("----------------------------");
          }
        } else {
          console.error(`Errore del server: ${response.status}`);
        }
      } catch (error) {
        console.error("Errore nel caricamento delle playlist", error);
      } finally {
        setLoading(false);
      }
    }
    caricaMiePlaylists();
  }, [isAuthenticated]);

  if (!loading && !isAuthenticated) {
      return (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontFamily: '"Inria Serif", serif', color: '#ff667c', backgroundColor: 'rgba(0,0,0,0.8)', padding: '2rem', borderRadius: '16px' }}>
                  Devi effettuare il login per vedere le tue playlist!
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
        padding: '4vh 4vw 6vh 4vw', 
        boxSizing: 'border-box' 
      }}
    >
      {}
      <Box sx={{ mb: '5vh', pl: '1vw', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2vh' }}>
        <Box>
            <Typography variant="h2" component="h1" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#d4efe2', letterSpacing: '3px', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              LE MIE PLAYLIST
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#d4efe2', opacity: 0.9, mt: '1vh', fontSize: '1.2rem' }}>
              La colonna sonora delle tue giornate!
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/playlist/new')} 
            sx={{ 
                backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: '12px', padding: '12px 24px', 
                fontFamily: '"Inria Serif", serif', textTransform: 'none', fontSize: '1.1rem',
                '&:hover': { backgroundColor: '#333333', transform: 'translateY(-2px)' },
                transition: 'all 0.2s ease'
            }}
        >
            Nuova Playlist
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : playlists.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: '10vh' }}>
            <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', color: '#d4efe2', mb: '2vh' }}>
              Non hai ancora creato nessuna playlist!
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: '"Inria Serif", serif', color: '#a9bdbc', fontSize: '1.2rem' }}>
              Clicca sul pulsante "Nuova Playlist" in alto per iniziare.
            </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: '4vh 3vw', 
            width: '100%',
          }}
        >
          {playlists.map((playlist, index) => (
            <Card 
              key={`pl-${playlist.id}-${index}`}
              sx={{ 
                borderRadius: '50px', 
                overflow: 'hidden', 
                background: 'linear-gradient(135deg, #4b5851 30%, #84a293 100%)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                transition: 'transform 0.2s, box-shadow 0.2s', 
                '&:hover': { transform: 'scale(1.03)', boxShadow: '0 12px 24px rgba(0,0,0,0.4)' } 
              }}
            >
              <CardActionArea 
                onClick={() => navigate(`/playlists/mie/${playlist.id}`)} 
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: '3vh', pb: '3vh', px: '2vw' }}
              >
                <Box
                  component="img"
                  src={playlist.imgUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='}
                  alt={playlist.nome} 
                  sx={{ 
                    width: '90%', aspectRatio: '1/1', borderRadius: '24px', objectFit: 'cover', boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                    backgroundColor: '#ffffff',
                  }}
                  onError={(e: any) => { 
                    e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; 
                  }}
                />

                <CardContent sx={{ padding: 0, mt: '3vh', textAlign: 'center', width: '100%', '&:last-child': { pb: 0 } }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px', fontSize: { xs: '1.4rem', md: '1.8rem' }, lineHeight: 1.2, mb: '1vh' }}
                  >
                    {playlist.nome}
                  </Typography>

                  <Typography variant="subtitle1" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#d4efe2', fontSize: '1.1rem' }}>
                    {playlist.brani ? playlist.brani.length : 0} Brani
                  </Typography>

                  {playlist.dataCreazione && (
                    <Typography variant="body2" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#a9bdbc', mt: '0.5vh' }}>
                      Creata il: {playlist.dataCreazione.split('-').reverse().join('-')}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}