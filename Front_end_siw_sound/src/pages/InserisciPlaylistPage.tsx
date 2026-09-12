import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

export function InserisciPlaylistPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Stati del form
    const [nome, setNome] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [braniSelezionati, setBraniSelezionati] = useState<string[]>([]);
    
    // Lista brani caricati dal DB
    const [tuttiIBrani, setTuttiIBrani] = useState<any[]>([]);

    const customInputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&.Mui-focused fieldset': { borderColor: '#1a1a1a' }
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#1a1a1a' }
    };

    useEffect(() => {
        // Carichiamo tutti i brani disponibili per popolare la tendina
        async function fetchBrani() {
            try {
                const response = await fetch('http://localhost:8080/api/brani');
                if (response.ok) {
                    setTuttiIBrani(await response.json());
                }
            } catch (error) {
                console.error("Errore nel caricamento brani", error);
            }
        }
        fetchBrani();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepariamo l'oggetto Playlist per il backend
        const nuovaPlaylist = {
            nome: nome,
            imgUrl: imgUrl,
            // Trasformiamo gli ID selezionati in oggetti {id: ...}
            brani: braniSelezionati.map(id => ({ id: parseInt(id) }))
        };

        try {
            const response = await fetch('http://localhost:8080/api/playlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(nuovaPlaylist)
            });

            if (response.ok) {
                alert('Playlist creata con successo!');
                navigate('/playlists/mie');
            } else {
                alert('Errore durante la creazione della playlist.');
            }
        } catch (error) {
            console.error("Errore di rete", error);
        }
    };

    if (!isAuthenticated) {
        return <Typography sx={{color: 'white', p: 5}}>Devi essere loggato per creare una playlist.</Typography>;
    }

    return (
        <Box sx={{ 
            width: '100%', height: '100%', overflowY: 'auto', padding: '6vh 4vw', 
            backgroundColor: '#5c6b63', backgroundImage: `${noisePattern}, linear-gradient(135deg, #5c6b63 0%, #84a293 100%)`,
            backgroundBlendMode: 'overlay, normal', display: 'flex', flexDirection: 'column', alignItems: 'center' 
        }}>
            <Box sx={{ width: '100%', maxWidth: '650px', mb: '4vh' }}>
                <Typography onClick={() => navigate('/playlists/mie')} sx={{ fontFamily: '"Inria Serif", serif', color: '#000', cursor: 'pointer', textDecoration: 'underline', mb: 2 }}>
                    ← Torna alle mie playlist
                </Typography>
                <Typography variant="h2" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#000' }}>
                    Nuova Playlist
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ width: '100%', maxWidth: '650px', padding: '40px', borderRadius: '30px', display: 'flex', flexDirection: 'column', gap: '3vh' }} component="form" onSubmit={handleSubmit}>
                
                <TextField label="Nome della Playlist" required fullWidth value={nome} onChange={(e) => setNome(e.target.value)} sx={customInputStyle} />

                <TextField label="URL Immagine Copertina" fullWidth value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} sx={customInputStyle} />

                {/* Selezione Multipla Brani */}
                <FormControl fullWidth sx={customInputStyle}>
                    <InputLabel id="brani-label">Aggiungi Brani</InputLabel>
                    <Select
                        labelId="brani-label"
                        multiple
                        value={braniSelezionati}
                        onChange={(e) => setBraniSelezionati(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                        input={<OutlinedInput label="Aggiungi Brani" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((id) => {
                                    const b = tuttiIBrani.find(item => item.id.toString() === id);
                                    return <Chip key={id} label={b ? b.nome : id} />;
                                })}
                            </Box>
                        )}
                    >
                        {tuttiIBrani.map((brano) => (
                            <MenuItem key={brano.id} value={brano.id.toString()}>
                                {brano.nome} {brano.autore ? `- ${brano.autore.nome}` : ''}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" size="large" sx={{ backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '12px', padding: '16px', '&:hover': { backgroundColor: '#333' } }}>
                    Crea Playlist
                </Button>
            </Paper>
        </Box>
    );
}