import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActionArea, CircularProgress, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function AlbumListPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    async function caricaAlbums() {
      try {
        const response = await fetch('http://localhost:8080/api/albums');
        if (response.ok) {
          const dati = await response.json();
          console.log("Dati Album dal DB:", dati);
          setAlbums(dati);
        } else {
          console.error("Errore nella risposta del server");
        }
      } catch (error) {
        console.error("Errore nel caricamento degli album", error);
      } finally {
        setLoading(false);
      }
    }
    caricaAlbums();
  }, []);

  const searchInputStyle = {
    mb: '4vh',
    width: { xs: '100%', sm: '350px' },
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      '& fieldset': {
        borderColor: 'rgba(212, 239, 226, 0.4)',
      },
      '&:hover fieldset': {
        borderColor: '#d4efe2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#d4efe2',
      }
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(212, 239, 226, 0.7)',
      fontFamily: '"Inria Serif", serif',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#d4efe2',
    }
  };

  const albumsFiltrati = albums.filter(album =>
    album.nome ? album.nome.toLowerCase().startsWith(searchQuery.toLowerCase()) : false
  );

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
          LISTA ALBUM
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
          Esplora tra gli album più iconici della storia!
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : albums.length === 0 ? (
        <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', color: '#d4efe2', textAlign: 'center', mt: '10vh' }}>
          Nessun album presente nel database!
        </Typography>
      ) : (
        <>
          <Box sx={{ pl: '1vw', display: 'flex', justifyContent: 'flex-start' }}>
            <TextField
              label="Filtra per titolo..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={searchInputStyle}
            />
          </Box>

          {albumsFiltrati.length === 0 ? (
            <Typography variant="h5" sx={{ fontFamily: '"Inria Serif", serif', color: '#d4efe2', opacity: 0.8, textAlign: 'center', mt: '5vh' }}>
              Nessun album inizia con la lettera "{searchQuery}".
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)', 
                  lg: 'repeat(4, 1fr)' 
                },
                gap: '4vh 3vw', 
                width: '100%',
              }}
            >
              {albumsFiltrati.map((album, index) => (
                <Card 
                  key={`${album.id}-${index}`}
                  sx={{ 
                    borderRadius: '40px', 
                    overflow: 'hidden', 
                    background: 'linear-gradient(135deg, #4b5851 30%, #84a293 100%)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    transition: 'transform 0.2s, box-shadow 0.2s', 
                    '&:hover': { 
                      transform: 'scale(1.03)', 
                      boxShadow: '0 12px 24px rgba(0,0,0,0.4)' 
                    } 
                  }}
                >
                  <CardActionArea 
                    onClick={() => navigate(`/albums/${album.id}`)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      pt: '3vh',
                      pb: '3vh', 
                      px: '2vw',
                    }}
                  >
                    <Box
                      component="img"
                      src={album.imgUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='}
                      alt={album.nome} 
                      sx={{ 
                        width: '90%', 
                        aspectRatio: '1/1', 
                        borderRadius: '16px', 
                        objectFit: 'cover', 
                        boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
                        backgroundColor: '#ffffff',
                        backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                        color: 'transparent',
                      }}
                      onError={(e: any) => { 
                        e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; 
                        e.target.alt = ''; 
                      }}
                    />

                    <CardContent sx={{ padding: 0, mt: '3vh', textAlign: 'center', width: '100%', '&:last-child': { pb: 0 } }}>
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        sx={{ 
                          fontFamily: '"Inria Serif", serif', 
                          fontWeight: 700, 
                          color: '#ffffff', 
                          letterSpacing: '0.5px',
                          fontSize: { xs: '1.4rem', md: '1.8rem' },
                          lineHeight: 1.2,
                          mb: '1vh'
                        }}
                      >
                        {album.nome}
                      </Typography>

                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontFamily: '"Inria Serif", serif', 
                          fontWeight: 400, 
                          color: '#d4efe2', 
                          fontSize: '1.1rem' 
                        }}
                      >
                        {album.autore ? album.autore.nome : 'Autore Sconosciuto'}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}