import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

export function EliminaArtistaPage() {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const [artisti, setArtisti] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [artistaSelezionato, setArtistaSelezionato] = useState<any>(null);

    const customInputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&.Mui-focused fieldset': { borderColor: '#1a1a1a' }
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#1a1a1a' },
    };

    useEffect(() => {
        async function fetchArtisti() {
            try {
                const response = await fetch('http://localhost:8080/api/artisti');
                if (response.ok) {
                    const data = await response.json();
                    setArtisti(data);
                }
            } catch (error) {
                console.error("Errore nel caricamento artisti", error);
            }
        }
        fetchArtisti();
    }, []);

    const handleSelectChange = (event: any) => {
        const id = event.target.value;
        setSelectedId(id);
        const scelto = artisti.find((a) => a.id.toString() === id.toString());
        setArtistaSelezionato(scelto || null);
    };

   
    const handleDelete = async () => {
        const confermato = window.confirm(`Sei sicuro di voler eliminare DEFINITIVAMENTE l'artista "${artistaSelezionato?.nome}"? Questa azione non può essere annullata.`);
        
        if (!confermato) return;

        try {
            const response = await fetch(`http://localhost:8080/api/artisti/${selectedId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                alert('Artista eliminato con successo!');
                navigate('/admin/artista');
            } else if (response.status === 409 || response.status === 500) {
                alert('Impossibile eliminare l\'artista. Assicurati che non abbia album o brani collegati nel database!');
            } else {
                alert('Si è verificato un errore durante l\'eliminazione.');
            }
        } catch (error) {
            console.error("Errore di rete", error);
        }
    };

    if (!isAdmin) {
        return (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontFamily: '"Inria Serif", serif', color: '#ff667c', backgroundColor: 'rgba(0,0,0,0.8)', padding: '2rem', borderRadius: '16px' }}>
                    Accesso Negato: Pagina riservata agli amministratori.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '100%', height: '100%', overflowY: 'auto', padding: '6vh 4vw', margin: '1.7vw',
                borderRadius: '30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center',
                backgroundColor: '#5c6b63', backgroundImage: `${noisePattern}, linear-gradient(135deg, #5c6b63 0%, #84a293 100%)`,
                backgroundBlendMode: 'overlay, normal'
            }}
        >
            {}
            <Box sx={{ width: '100%', maxWidth: '650px', mb: '4vh' }}>
                <Typography
                    onClick={() => navigate('/admin/artista')}
                    sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#000000', fontSize: '1rem', mb: '1vh', cursor: 'pointer', textDecoration: 'underline', '&:hover': { color: '#000000' } }}
                >
                    ← Annulla e torna indietro
                </Typography>
                <Typography variant="h2" component="h1" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#000000', letterSpacing: '1px', fontSize: { xs: '2.5rem', md: '3rem' } }}>
                    Elimina Artista
                </Typography>
            </Box>

            {}
            <Paper elevation={0} sx={{ width: '100%', maxWidth: '650px', margin: '0.5vh 3vw 3vh 3vw', padding: { xs: '20px', md: '30px' }, borderRadius: '30px', backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                <FormControl fullWidth sx={customInputStyle}>
                    <InputLabel id="select-artista-label">Seleziona l'artista da eliminare</InputLabel>
                    <Select labelId="select-artista-label" value={selectedId} label="Seleziona l'artista da eliminare" onChange={handleSelectChange} sx={{ borderRadius: '12px' }}>
                        {artisti.map((artista) => (
                            <MenuItem key={artista.id} value={artista.id}>
                                {artista.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {}
            {artistaSelezionato && (
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%', maxWidth: '650px', margin: '0.5vh 3vw', padding: { xs: '30px', md: '40px' },
                        borderRadius: '30px', backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2vh',
                        animation: 'fadeIn 0.5s ease-in-out',
                        '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(-10px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
                    }}
                >
                    <Typography variant="body1" sx={{ fontFamily: '"Inria Serif", serif', color: '#b10606', mb: '1vh', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}>
                        Attenzione: Stai per eliminare questo artista.
                    </Typography>

                    {}
                    {artistaSelezionato.imgUrl ? (
                        <Box component="img" src={artistaSelezionato.imgUrl} alt={artistaSelezionato.nome} sx={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', border: '4px solid #ff667c', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }} onError={(e: any) => { e.target.style.display = 'none'; }} />
                    ) : (
                        <Box sx={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '4px solid #ff667c' }}>
                            <Typography sx={{ color: '#999' }}>Nessuna foto</Typography>
                        </Box>
                    )}

                    <Typography variant="h4" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#1a1a1a', mt: '1vh' }}>
                        {artistaSelezionato.nome}
                    </Typography>

                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                            mt: '3vh', backgroundColor: '#ff667c', color: '#ffffff', borderRadius: '12px', padding: '16px', fontSize: '1.2rem', fontFamily: '"Inria Serif", serif', letterSpacing: '1px', textTransform: 'none',
                            '&:hover': { backgroundColor: '#e63946', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(255,102,124,0.4)' },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Elimina Definitivamente
                    </Button>
                </Paper>
            )}
        </Box>
    );
}