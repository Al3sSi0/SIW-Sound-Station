import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'; 

const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

export function PlaylistPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [playlist, setPlaylist] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        async function fetchPlaylistDettaglio() {
            try {
                const response = await fetch(`http://localhost:8080/api/playlists/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const dati = await response.json();
                        setPlaylist(dati);
                    } else {
                        setError("Risposta del server malformata.");
                    }
                } else if (response.status === 404) {
                    setError("Playlist non trovata.");
                } else {
                    setError("Errore durante il caricamento della playlist.");
                }
            } catch (err) {
                console.error(err);
                setError("Errore di rete, connessione fallita.");
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchPlaylistDettaglio();
    } , [id]);


    const handleRemoveBrano = async (branoId: number, e: React.MouseEvent) => {
        e.stopPropagation(); 

        try {
            const response = await fetch(`http://localhost:8080/api/playlists/${id}/brani/${branoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setPlaylist((prevPlaylist: any) => ({
                    ...prevPlaylist,
                    brani: prevPlaylist.brani.filter((b: any) => b.id !== branoId)
                }));
            } else {
                alert("Impossibile rimuovere il brano dalla playlist.");
            }
        } catch (err) {
            console.error(err);
            alert("Errore di rete, impossibile rimuovere il brano.");
        }
    };

   
    const handleDeletePlaylist = async () => {
        const conferma = window.confirm("Sei sicuro di voler eliminare definitivamente questa playlist?");
        if (!conferma) return;

        try {
            const response = await fetch(`http://localhost:8080/api/playlists/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                alert("Playlist eliminata con successo!");
                navigate('/playlists/mie');
            } else {
                alert("Impossibile eliminare la playlist. Verificare i permessi.");
            }
        } catch (err) {
            console.error(err);
            alert("Errore di rete, impossibile completare l'operazione.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c6b63' }}>
                <CircularProgress sx={{ color: '#d4efe2' }} />
            </Box>
        );
    }

    if (error || !playlist) {
        return (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c6b63', color: 'white', p: 4 }}>
                <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', mb: 2 }}>{error || "Si è verificato un errore."}</Typography>
                <Typography onClick={() => navigate('/playlists/mie')} sx={{ color: '#d4efe2', cursor: 'pointer', textDecoration: 'underline' }}>
                    Torna alle mie playlist
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            overflowY: 'auto', 
            backgroundColor: '#5c6b63',
            backgroundImage: `${noisePattern}, linear-gradient(135deg, #5c6b63 0%, #84a293 100%)`,
            backgroundBlendMode: 'overlay, normal',
            boxSizing: 'border-box',
            padding: '2vw',      
            margin: '1.7vw',    
            borderRadius: '30px' 
        }}>
            
            <Typography onClick={() => navigate('/playlists/mie')} sx={{ fontFamily: '"Inria Serif", serif', color: '#000', cursor: 'pointer', textDecoration: 'underline', mb: '4vh', display: 'inline-block' }}>
                ← Torna alle mie playlist
            </Typography>

            {}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-end' }, gap: '3vw', mb: '6vh', textAlign: { xs: 'center', sm: 'left' } }}>
                <Box
                    component="img"
                    src={playlist.imgUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='}
                    alt={playlist.nome}
                    sx={{
                        width: { xs: '200px', sm: '240px' }, aspectRatio: '1/1', borderRadius: '24px', objectFit: 'cover',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.5)', backgroundColor: '#fff'
                    }}
                    onError={(e: any) => { e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; }}
                />
                <Box sx={{ color: '#000', width: '100%' }}>
                    <Typography variant="h2" component="h1" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, fontSize: { xs: '2.5rem', md: '4rem' }, lineHeight: 1.1, mb: 2 }}>
                        {playlist.nome}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.5vw', flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' }, opacity: 0.9 }}>
                        <MusicNoteIcon fontSize="small" /> {playlist.brani ? playlist.brani.length : 0} brani
                        {playlist.dataCreazione && (
                            <>
                                <Typography sx={{ fontFamily: '"Inria Serif", serif' }}>•</Typography>
                                <Typography sx={{ fontFamily: '"Inria Serif", serif', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CalendarTodayIcon fontSize="small" /> {playlist.dataCreazione.split('-').reverse().join('-')}
                                </Typography>
                            </>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: '15px', mt: '3vh', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditing(!isEditing)} 
                            sx={{
                                backgroundColor: isEditing ? '#2e7d32' : '#1a1a1a', 
                                color: '#fff',
                                borderRadius: '14px',
                                textTransform: 'none',
                                padding: '8px 22px',
                                fontFamily: '"Inria Serif", serif',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                '&:hover': { backgroundColor: isEditing ? '#1b5e20' : '#333' }
                            }}
                        >
                            {isEditing ? 'Fine Modifica' : 'Modifica'}
                        </Button>
                        
                        {!isEditing && (
                            <Button
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeletePlaylist}
                                sx={{
                                    color: '#2b1111',
                                    borderColor: '#2b1111',
                                    borderRadius: '14px',
                                    textTransform: 'none',
                                    padding: '8px 22px',
                                    fontFamily: '"Inria Serif", serif',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    '&:hover': {
                                        borderColor: '#5a1818',
                                        backgroundColor: 'rgba(90, 24, 24, 0.08)'
                                    }
                                }}
                            >
                                Elimina
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.93)', borderRadius: '30px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
                {(!playlist.brani || playlist.brani.length === 0) ? (
                    <Box sx={{ padding: '40px', textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontFamily: '"Inria Serif", serif', color: '#555', mb: 1 }}>Questa playlist è vuota</Typography>
                        <Typography variant="body2" sx={{ fontFamily: '"Inria Serif", serif', color: '#777' }}>Aggiungi dei brani modificando la playlist o navigando nel catalogo.</Typography>
                    </Box>
                ) : (
                    playlist.brani.map((brano: any, index: number) => {
                        if (!brano) return null;

                        return (
                            <Box
                                key={`track-${brano.id || index}-${index}`}
                                onClick={() => brano.id && navigate(`/brani/${brano.id}`)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    padding: '12px 20px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                                        transform: 'translateX(8px)'
                                    }
                                }}
                            >
                                <Typography sx={{ fontFamily: '"Inria Serif", serif', width: '30px', color: '#666', fontWeight: 600, fontSize: '1.1rem', textAlign: 'center' }}>
                                    {index + 1}
                                </Typography>

                                <Box
                                    component="img"
                                    src={brano.imgUrl || brano.album?.imgUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='}
                                    alt={brano.nome || 'Traccia'}
                                    sx={{
                                        width: '55px',
                                        height: '55px',
                                        borderRadius: '12px',
                                        objectFit: 'cover',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        backgroundColor: '#e0e0e0'
                                    }}
                                    onError={(e: any) => {
                                        e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
                                    }}
                                />

                                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <Typography sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, fontSize: '1.2rem', color: '#1a1a1a', lineHeight: 1.2 }}>
                                        {brano.nome || 'Titolo Sconosciuto'}
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, fontSize: '0.92rem', color: '#555', mt: 0.3 }}>
                                        {brano.autore?.nome || brano.nomeAutore || 'Autore Sconosciuto'}
                                    </Typography>
                                </Box>

                                {isEditing && (
                                    <IconButton 
                                        color="error" 
                                        onClick={(e) => handleRemoveBrano(brano.id, e)}
                                        sx={{ 
                                            backgroundColor: 'rgba(211, 47, 47, 0.05)',
                                            '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' } 
                                        }}
                                    >
                                        <RemoveCircleIcon />
                                    </IconButton>
                                )}
                            </Box>
                        );
                    })
                )}
            </Paper>
        </Box>
    );
}