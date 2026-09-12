import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

export function ModificaArtistaPage() {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const [artisti, setArtisti] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');

    const [nome, setNome] = useState('');
    const [dataNascita, setDataNascita] = useState('');
    const [nazionalita, setNazionalita] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    const customInputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&.Mui-focused fieldset': {
                borderColor: '#1a1a1a',
            }
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#1a1a1a',
        },
        
        '& input[type="date"]::-webkit-datetime-edit-day-field:focus, & input[type="date"]::-webkit-datetime-edit-month-field:focus, & input[type="date"]::-webkit-datetime-edit-year-field:focus': {
            backgroundColor: '#84a293 !important',
            color: '#1a1a1a !important',
            outline: 'none'
        }
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

        const artistaScelto = artisti.find((a) => a.id.toString() === id.toString());

        if (artistaScelto) {
            setNome(artistaScelto.nome || '');
            setDataNascita(artistaScelto.dataNascita || ''); 
            setNazionalita(artistaScelto.nazionalita || '');
            setImgUrl(artistaScelto.imgUrl || '');
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const artistaAggiornato = {
            nome: nome,
            dataNascita: dataNascita || null,
            nazionalita: nazionalita,
            imgUrl: imgUrl
        };

        try {
            const response = await fetch(`http://localhost:8080/api/artisti/${selectedId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(artistaAggiornato)
            });

            if (response.ok) {
                alert('Artista modificato con successo!');
                navigate('/admin/artista');
            } else if (response.status === 400) {
                alert('Attenzione: i dati inseriti non rispettano i vincoli del database.');
            } else {
                alert('Si è verificato un errore sul server.');
            }
        } catch (error) {
            console.error("Errore di rete", error);
        }
    };

    if (!isAdmin) {
        return (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography
                    variant="h5"
                    sx={{ fontFamily: '"Inria Serif", serif', color: '#ff667c', backgroundColor: 'rgba(0,0,0,0.8)', padding: '2rem', borderRadius: '16px' }}
                >
                    Accesso Negato: Pagina riservata agli amministratori.
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
                padding: '6vh 4vw',
                margin: '1.7vw',
                borderRadius: '30px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#5c6b63',
                backgroundImage: `${noisePattern}, linear-gradient(135deg, #5c6b63 0%, #84a293 100%)`,
                backgroundBlendMode: 'overlay, normal'
            }}
        >
            {}
            <Box sx={{ width: '100%', maxWidth: '650px', mb: '4vh' }}>
                <Typography
                    onClick={() => navigate('/admin/artista')}
                    sx={{
                        fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#000000',
                        fontSize: '1rem', mb: '1vh', cursor: 'pointer', textDecoration: 'underline',
                        '&:hover': { color: '#000000' }
                    }}
                >
                    ← Annulla e torna indietro
                </Typography>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#000000', letterSpacing: '1px', fontSize: { xs: '2.5rem', md: '3rem' } }}
                >
                    Modifica Artista
                </Typography>
            </Box>

            {}
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: '650px',
                    margin: '0.5vh 3vw 3vh 3vw',
                    padding: { xs: '20px', md: '30px' },
                    borderRadius: '30px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                }}
            >
                <FormControl fullWidth sx={customInputStyle}>
                    <InputLabel id="select-artista-label">Seleziona un artista da modificare</InputLabel>
                    <Select
                        labelId="select-artista-label"
                        value={selectedId}
                        label="Seleziona un artista da modificare"
                        onChange={handleSelectChange}
                        sx={{ borderRadius: '12px' }}
                    >
                        {artisti.map((artista) => (
                            <MenuItem key={artista.id} value={artista.id}>
                                {artista.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {}
            {selectedId && (
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        maxWidth: '650px',
                        margin: '0.5vh 3vw',
                        padding: { xs: '30px', md: '40px' },
                        borderRadius: '30px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3vh',
                        animation: 'fadeIn 0.5s ease-in-out',
                        '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(-10px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
                    }}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="body1" sx={{ fontFamily: '"Inria Serif", serif', color: '#000000', mb: '1vh', fontSize: '1.1rem' }}>
                        Modifica i dati anagrafici dell'artista. I campi contrassegnati con * sono obbligatori.
                    </Typography>

                    <TextField
                        label="Nome"
                        variant="outlined"
                        fullWidth
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        sx={customInputStyle}
                    />

                    <TextField
                        label="Nazionalità"
                        variant="outlined"
                        fullWidth
                        placeholder="Es: Italia, Stati Uniti, Regno Unito..."
                        value={nazionalita}
                        onChange={(e) => setNazionalita(e.target.value)}
                        sx={customInputStyle}
                    />

                    <TextField
                        label="Data di Nascita"
                        type="date"
                        variant="outlined"
                        fullWidth
                        value={dataNascita}
                        onChange={(e) => setDataNascita(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                        sx={customInputStyle}
                    />

                    <TextField
                        label="URL Immagine Profilo"
                        type="url"
                        variant="outlined"
                        fullWidth
                        placeholder="https://..."
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                        slotProps={{
                            htmlInput: {
                                maxLength: 200
                            }
                        }}
                        sx={customInputStyle}
                    />

                    {imgUrl && (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <Box
                                component="img"
                                src={imgUrl}
                                alt="Preview"
                                sx={{
                                    width: '140px',
                                    height: '140px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                                    border: '4px solid #000000'
                                }}
                                onError={(e: any) => { e.target.style.display = 'none'; }}
                            />
                        </Box>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                            mt: '2vh',
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            borderRadius: '12px',
                            padding: '16px',
                            fontSize: '1.2rem',
                            fontFamily: '"Inria Serif", serif',
                            letterSpacing: '1px',
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#333333', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Salva Modifiche
                    </Button>
                </Paper>
            )}
        </Box>
    );
}