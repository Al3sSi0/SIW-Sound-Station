import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

// Aggiunto "subtitle" opzionale tra le props dell'ItemCard
const ItemCard = ({ item, pathPrefix, subtitle }: { item: any; pathPrefix: string; subtitle?: string }) => {
  const navigate = useNavigate();

  const coverImage = item.imgUrl || (item.album ? item.album.imgUrl : null) || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        component="img"
        src={coverImage}
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
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
          color: 'transparent',
          '&:hover': {
            transform: 'scale(1.08)', 
            boxShadow: '0 12px 24px rgba(0,0,0,0.6)', 
          },
        }}
        onError={(e: any) => { 
          e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; 
          e.target.alt = ''; 
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
          lineHeight: 1.2
        }}
      >
        {item.nome}
      </Typography>
      
      {/* SEZIONE SOTTOTITOLO: appare solo se passiamo la prop "subtitle" */}
      {subtitle && (
        <Typography
          sx={{
            fontFamily: '"Inria Serif", serif',
            fontWeight: 400,
            color: '#a9bdbc', // Un grigio-verdino per differenziarlo dal titolo
            mt: '0.5vh',
            fontSize: { xs: '0.9rem', md: '1.1rem' },
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export function ArtistaPage() {
  const { id } = useParams(); 
  const [artista, setArtista] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchArtistaReale() {
      try {
        const response = await fetch(`http://localhost:8080/api/artisti/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setArtista(data); 
        } else {
          console.error("Artista non trovato nel DB");
        }
      } catch (error) {
        console.error("Errore di connessione a Spring Boot:", error);
      } finally {
        setLoading(false); 
      }
    }

    fetchArtistaReale();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!artista) return <Typography sx={{fontSize:'180%', color: '#d4efe2',p:8, textAlign:'center' }}>Artista non trovato!</Typography>;

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
          src={artista.imgUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='}
          alt={artista.nome}
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
          <Typography variant="h1" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 800, color: '#000000', letterSpacing: '1px' }}>
            {artista.nome}
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#e0e0e0' }}>
            Nazionalità: <strong>{artista.nazionalita}</strong>
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#e0e0e0' }}>
            Nato il: <strong>{artista.dataNascita ? artista.dataNascita.split('-').reverse().join('-') : 'Data non disponibile'}</strong>
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          minHeight: '60vh', 
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
          const listaAlbum = artista.albumIncisi || [];            
          const listaSingoli = (artista.braniIncisi || []).filter((brano: any) => !brano.album);          
          const listaFeat = artista.braniOspite || [];      

          const haAlbums = listaAlbum.length > 0;
          const haSingoli = listaSingoli.length > 0;
          const haCollaborazioni = listaFeat.length > 0;
          const haContenuti = haAlbums || haSingoli || haCollaborazioni;

          if (!haContenuti) {
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
                Non ci sono contenuti di questo artista!
              </Typography>
            );
          }

          return (
            <>
              {haAlbums && (
                <Box sx={{ mb: '4vh', pt: '2vh' }}>
                  <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', mb: '3vh' }}>
                    ALBUMS:
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                      gap: '3vh 2vw',
                    }}
                  >
                    {listaAlbum.map((album: any) => (
                      <ItemCard key={`album-${album.id}`} item={album} pathPrefix="albums" />
                    ))}
                  </Box>
                </Box>
              )}

              {haAlbums && (haSingoli || haCollaborazioni) && (
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: '4vh' }} />
              )}

              {haSingoli && (
                <Box sx={{ mb: '4vh' }}>
                  <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', mb: '3vh' }}>
                    SINGOLI:
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                      gap: '3vh 2vw',
                    }}
                  >
                    {listaSingoli.map((singolo: any) => (
                      <ItemCard key={`singolo-${singolo.id}`} item={singolo} pathPrefix="brani" />
                    ))}
                  </Box>
                </Box>
              )}

              {haSingoli && haCollaborazioni && (
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: '4vh' }} />
              )}

              {haCollaborazioni && (
                <Box sx={{ mb: '4vh' }}>
                  <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', mb: '3vh' }}>
                    BRANI FEATURING:
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                      gap: '3vh 2vw',
                    }}
                  >
                    {listaFeat.map((feat: any) => (
                      <ItemCard 
                        key={`feat-${feat.id}`} 
                        item={feat} 
                        pathPrefix="brani" 
                        subtitle={feat.autore ? `di ${feat.autore.nome}` : ''}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </>
          );
        })()}
      </Box>
    </Box>
  );
}