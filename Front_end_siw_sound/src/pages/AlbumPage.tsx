import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

const ItemCard = ({ item, pathPrefix, fallbackImg }: { item: any; pathPrefix: string; fallbackImg?: string }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        component="img"
        src={item.imgUrl || fallbackImg || 'https://via.placeholder.com/150'}
        alt={item.nome}
        onClick={() => navigate(`/${pathPrefix}/${item.id}`)}
        sx={{
          width: '100%',
          aspectRatio: '1/1', 
          borderRadius: '16px',
          cursor: 'pointer',
          objectFit: 'cover',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          '&:hover': {
            transform: 'scale(1.08)', 
            boxShadow: '0 12px 24px rgba(0,0,0,0.6)', 
          },
        }}
      />
      <Typography
        sx={{
          fontFamily: '"Inria Serif", serif',
          fontWeight: 400,
          color: '#ffffff',
          mt: '1.5vh',
          fontSize: { xs: '1.1rem', md: '1.4rem' },
          textAlign: 'center',
          opacity: 0.9,
        }}
      >
        {item.nome}
      </Typography>
    </Box>
  );
};

export function AlbumPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAlbumReale() {
      try {
        const response = await fetch(`http://localhost:8080/api/albums/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setAlbum(data); 
        } else {
          console.error("Album non trovato nel DB");
        }
      } catch (error) {
        console.error("Errore di connessione a Spring Boot:", error);
      } finally {
        setLoading(false); 
      }
    }

    fetchAlbumReale();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!album) return <Typography sx={{fontSize:'180%', color: '#d4efe2',p:8, textAlign:'center' }}>Album non trovato!</Typography>;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflowY: 'auto', 
        backgroundColor: '#5c6b63',
        backgroundImage: `${noisePattern}, linear-gradient(135deg, #5c6b63 0%, #84a293 100%)`,
        backgroundBlendMode: 'overlay, normal',
        boxSizing: 'border-box',
        padding: '2vw',
        margin: '1.7vw',
        borderRadius: '30px',
      }}
    >
      {}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: 'center',
          gap: '3vw',
          padding: '4vh 5vw',
        }}
      >
        <Box
          component="img"
          src={album.imgUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='} 
          alt={album.nome}
          sx={{
            width: { xs: '60vw', md: '25vw' },
            aspectRatio: '1/1',
            borderRadius: '24px', 
            objectFit: 'cover',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            margin: '0.3vw',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
            color: 'transparent',
          }}
          onError={(e: any) => { 
           e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; 
           e.target.alt = ''; 
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
          
          <Typography variant="h1" sx={{fontSize:'400%', fontFamily: '"Inria Serif", serif', fontWeight: 800, color: '#000000', letterSpacing: '1px' }}>
            {album.nome}
          </Typography>
          
          {}
          {album.autore && (
            <Typography 
              variant="h5" 
              onClick={() => navigate(`/artisti/${album.autore.id}`)}
              sx={{ 
                fontFamily: '"Inria Serif", serif', 
                fontWeight: 600, 
                color: '#e0e0e0',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: '#ffffff'
                }
              }}
            >
              Autore: {album.autore.nome}
            </Typography>
          )}

          <Typography variant="h6" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#e0e0e0', mt: '1vh' }}>
            Anno di uscita: <strong>{album.anno || 'Sconosciuto'}</strong>
          </Typography>

        </Box>
      </Box>

      {}
      <Box
        sx={{
          width: '100%',
          minHeight: '50vh', 
          backgroundColor: '#3b423f', 
          backgroundImage: `${noisePattern}, linear-gradient(to top, rgba(47, 47, 47, 0.6), rgba(0, 0, 0, 0.8))`,
          backgroundBlendMode: 'overlay, normal',
          padding: '2vh 5vw 20vh 5vw', 
          borderTop: '2px solid rgba(255,255,255,0.1)',
          borderRadius: '30px',
          margin: '4vh 0 4vh 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        {(() => {
          const listaBrani = album.brani || [];             

          if (listaBrani.length === 0) {
            return (
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: '"Inria Serif", serif', 
                  color: '#ffffff', 
                  textAlign: 'center', 
                  margin: 'auto', 
                  opacity: 0.7,
                  letterSpacing: '1px'
                }}
              >
                Non ci sono brani in questo album!
              </Typography>
            );
          }

          return (
            <Box sx={{ mb: '4vh', pt: '2vh' }}>
              <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', mb: '3vh' }}>
                BRANI:
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: '3vh 2vw',
                }}
              >
                {listaBrani.map((brano: any) => (
                  <ItemCard 
                    key={`brano-${brano.id}`} 
                    item={brano} 
                    pathPrefix="brani" 
                    fallbackImg={album.imgUrl} 
                  />
                ))}
              </Box>
            </Box>
          );
        })()}
      </Box>
    </Box>
  );
}