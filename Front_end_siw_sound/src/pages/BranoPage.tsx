import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Checkbox 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

const ItemCard = ({ item, pathPrefix, fallbackImg }: { item: any; pathPrefix: string; fallbackImg?: string }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        component="img"
        src={item.imgUrl || fallbackImg || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='}
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
        }}
      >
        {item.nome}
      </Typography>
    </Box>
  );
};

export function BranoPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [brano, setBrano] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [playlistsUtente, setPlaylistsUtente] = useState<any[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<any[]>([]);
  const [invioInCorso, setInvioInCorso] = useState<boolean>(false);

  useEffect(() => {
    async function fetchBranoReale() {
      try {
        const response = await fetch(`http://localhost:8080/api/brani/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setBrano(data); 
        } else {
          console.error("Brano non trovato nel DB");
        }
      } catch (error) {
        console.error("Errore di connessione a Spring Boot:", error);
      } finally {
        setLoading(false); 
      }
    }

    fetchBranoReale();
  }, [id]);

  const handleOpenPlaylistModal = async () => {
    setOpenModal(true);
    try {
      const response = await fetch('http://localhost:8080/api/playlists/mie', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPlaylistsUtente(data);
      } else if (response.status === 401) {
        alert("Devi effettuare l'accesso per aggiungere brani alle tue playlist!");
        setOpenModal(false);
      }
    } catch (err) {
      console.error("Errore nel caricamento delle playlist:", err);
    }
  };

  const handleToggleCheckbox = (playlistId: number) => {
    setSelectedPlaylists((prevSelected) =>
      prevSelected.includes(playlistId)
        ? prevSelected.filter((id) => id !== playlistId)
        : [...prevSelected, playlistId]
    );
  };

  const handleSalvaInPlaylist = async () => {
  if (selectedPlaylists.length === 0) {
    setOpenModal(false);
    return;
  }

  setInvioInCorso(true);
  try {
    for (const playlistId of selectedPlaylists) {
      const response = await fetch(`http://localhost:8080/api/playlists/${playlistId}/brani/${id}`, {
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Controllo della risposta secondo le direttive del prof
      if (!response.ok) {
        throw new Error(`Errore del server con codice: ${response.status}`);
      }
    }
    
    // Se tutte le risposte sono OK, mostriamo il successo e chiudiamo pulito
    alert("Brano inserito con successo!");
    setOpenModal(false);
    setSelectedPlaylists([]);
  } catch (err) {
    console.error("Errore durante il salvataggio nei brani:", err);
    alert("Si è verificato un errore durante il salvataggio. Riprova.");
    // NOTA: Non azzeriamo selectedPlaylists e non chiudiamo il modal, 
    // in modo da seguire la direttiva "l'alert appare senza chiudere il dialog"
  } finally {
    setInvioInCorso(false);
  }
};

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!brano) return <Typography sx={{fontSize:'180%', color: '#d4efe2', p:8, textAlign:'center' }}>Brano non trovato!</Typography>;

  const coverImage = brano.imgUrl || (brano.album ? brano.album.imgUrl : null) || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
  const minuti = brano.minuti || 0;
  const secondi = String(brano.secondi || 0).padStart(2, '0');
  const annoDaMostrare = (brano.anno && brano.anno > 0) ? brano.anno : (brano.album ? brano.album.anno : null);

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
        position: 'relative'
      }}
    >
      
      <Button
        variant="contained"
        startIcon={<PlaylistAddIcon />}
        onClick={handleOpenPlaylistModal}
        sx={{
          position: { xs: 'relative', sm: 'absolute' },
          top: { sm: '4vh' },
          right: { sm: '4vw' },
          display: 'flex',
          margin: { xs: '2vh auto 0 auto', sm: '0' },
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          borderRadius: '14px',
          textTransform: 'none',
          padding: '10px 24px',
          fontFamily: '"Inria Serif", serif',
          fontWeight: 650,
          fontSize: '1rem',
          zIndex: 5,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          '&:hover': { backgroundColor: '#333333', transform: 'translateY(-1px)' },
          transition: 'all 0.2s'
        }}
      >
        Aggiungi a una playlist
      </Button>

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
          src={coverImage} 
          alt={brano.nome}
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
          
          <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4rem' }, fontFamily: '"Inria Serif", serif', fontWeight: 800, color: '#000000', letterSpacing: '1px' }}>
            {brano.nome}
          </Typography>
          
          {brano.autore && (
            <Typography 
              variant="h5" 
              onClick={() => navigate(`/artisti/${brano.autore.id}`)}
              sx={{ 
                fontFamily: '"Inria Serif", serif', 
                fontWeight: 600, 
                color: '#e0e0e0',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#ffffff' }
              }}
            >
              Autore: {brano.autore.nome}
            </Typography>
          )}

          {brano.album && (
            <Typography 
              variant="h6" 
              onClick={() => navigate(`/albums/${brano.album.id}`)}
              sx={{ 
                fontFamily: '"Inria Serif", serif', 
                fontWeight: 600, 
                color: '#a9bdbc',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#ffffff' }
              }}
            >
              Album: {brano.album.nome}
            </Typography>
          )}

          <Box sx={{ mt: '1vh', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
            {annoDaMostrare && (
              <Typography variant="body1" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#e0e0e0' }}>
                Anno di uscita: <strong>{annoDaMostrare}</strong>
              </Typography>
            )}
            
            {brano.genere && (
              <Typography variant="body1" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#e0e0e0' }}>
                Genere: <strong>{brano.genere}</strong>
              </Typography>
            )}

            {(brano.minuti > 0 || brano.secondi > 0) && (
              <Typography variant="body1" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#e0e0e0' }}>
                Durata: <strong>{minuti}:{secondi}</strong>
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

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
          const listaFeat = brano.featuring || [];            

          if (listaFeat.length === 0) {
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
                Non ci sono artisti ospiti in questo brano!
              </Typography>
            );
          }

          return (
            <Box sx={{ mb: '4vh', pt: '2vh' }}>
              <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#ffffff', mb: '3vh' }}>
                ARTISTI OSPITI:
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: '3vh 2vw',
                }}
              >
                {listaFeat.map((artista: any) => (
                  <ItemCard 
                    key={`feat-${artista.id}`} 
                    item={artista} 
                    pathPrefix="artisti" 
                  />
                ))}
              </Box>
            </Box>
          );
        })()}
      </Box>

      {/* 🛠️ DIALOG POPUP FIXATO: Gli stili sono spostati dentro sx puntando alla classe nativa del Paper */}
      <Dialog 
        open={openModal} 
        onClose={() => {
          if (!invioInCorso) {
            setOpenModal(false);
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#4b5851', 
            color: '#ffffff',
            borderRadius: '24px',
            padding: '15px',
            minWidth: { xs: '80vw', sm: '400px' }
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, fontSize: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.15)', pb: 1.5 }}>
          Seleziona Playlist
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, padding: '8px 0' }}>
          {playlistsUtente.length === 0 ? (
            <Typography sx={{ fontFamily: '"Inria Serif", serif', opacity: 0.8, p: 2, textAlign: 'center' }}>
              Non hai ancora creato nessuna playlist personale.
            </Typography>
          ) : (
            <List sx={{ maxHeight: '30vh', overflowY: 'auto' }}>
              {playlistsUtente.map((playlist) => {
                const checked = selectedPlaylists.includes(playlist.id);
                return (
                  <ListItem key={playlist.id} disablePadding divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <ListItemButton onClick={() => handleToggleCheckbox(playlist.id)} sx={{ borderRadius: '10px' }}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked}
                          tabIndex={-1}
                          disableRipple
                          sx={{ color: '#d4efe2', '&.Mui-checked': { color: '#d4efe2' } }}
                        />
                      </ListItemIcon>
                      
                      <ListItemText 
                        primary={
                          <Typography sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 600, color: '#ffffff', fontSize: '1.1rem' }}>
                            {playlist.nome}
                          </Typography>
                        } 
                        secondary={
                          <Typography sx={{ fontFamily: '"Inria Serif", serif', color: '#d4efe2', opacity: 0.7, fontSize: '0.88rem', mt: 0.3 }}>
                            {`${playlist.brani ? playlist.brani.length : 0} brani`}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.15)', pt: 2, gap: 1 }}>
          <Button 
            onClick={() => setOpenModal(false)} 
            disabled={invioInCorso}
            sx={{ color: '#ff667c', fontFamily: '"Inria Serif", serif', fontWeight: 600, textTransform: 'none' }}
          >
            Annulla
          </Button>
          <Button 
            onClick={handleSalvaInPlaylist} 
            disabled={invioInCorso || playlistsUtente.length === 0}
            variant="contained"
            sx={{ 
              backgroundColor: '#1a1a1a', 
              color: '#fff', 
              fontFamily: '"Inria Serif", serif', 
              fontWeight: 600, 
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              '&:hover': { backgroundColor: '#333' }
            }}
          >
            {invioInCorso ? <CircularProgress size={20} color="inherit" /> : 'Includi Brano'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}