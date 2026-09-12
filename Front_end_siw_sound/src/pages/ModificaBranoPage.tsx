import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const noisePattern = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

export function ModificaBranoPage() {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    // 1. Stati per i menu a tendina
    const [brani, setBrani] = useState<any[]>([]);
    const [artisti, setArtisti] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');

    // 2. Stati del form
    const [nome, setNome] = useState('');
    const [anno, setAnno] = useState('');
    const [genere, setGenere] = useState('');
    const [minuti, setMinuti] = useState('');
    const [secondi, setSecondi] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    
    // 3. Stati per le relazioni
    const [autoreId, setAutoreId] = useState('');
    const [albumId, setAlbumId] = useState('');
    const [featuringIds, setFeaturingIds] = useState<string[]>([]);

    const annoCorrente = new Date().getFullYear();

    const customInputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&.Mui-focused fieldset': { borderColor: '#1a1a1a' }
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#1a1a1a' }
    };

    // CARICAMENTO DI TUTTI I DATI ALL'AVVIO
    useEffect(() => {
        async function fetchData() {
            try {
                const resBrani = await fetch('http://localhost:8080/api/brani');
                if (resBrani.ok) setBrani(await resBrani.json());

                const resArtisti = await fetch('http://localhost:8080/api/artisti');
                if (resArtisti.ok) setArtisti(await resArtisti.json());

                const resAlbums = await fetch('http://localhost:8080/api/albums');
                if (resAlbums.ok) setAlbums(await resAlbums.json());
            } catch (error) {
                console.error("Errore nel caricamento dei dati", error);
            }
        }
        fetchData();
    }, []);

    // QUANDO SELEZIONO IL BRANO DA MODIFICARE
    const handleSelectChange = (event: any) => {
        const id = event.target.value;
        setSelectedId(id);

        const branoScelto = brani.find((b) => b.id.toString() === id.toString());

        if (branoScelto) {
            setNome(branoScelto.nome || '');
            setAnno(branoScelto.anno ? branoScelto.anno.toString() : '');
            setGenere(branoScelto.genere || '');
            setMinuti(branoScelto.minuti ? branoScelto.minuti.toString() : '');
            setSecondi(branoScelto.secondi ? branoScelto.secondi.toString() : '');
            setImgUrl(branoScelto.imgUrl || '');
            
            // Relazioni
            setAutoreId(branoScelto.autore ? branoScelto.autore.id : '');
            setAlbumId(branoScelto.album ? branoScelto.album.id : '');
            
            // Estraggo gli ID dei featuring per la Select Multipla
            if (branoScelto.featuring && Array.isArray(branoScelto.featuring)) {
                setFeaturingIds(branoScelto.featuring.map((f: any) => f.id));
            } else {
                setFeaturingIds([]);
            }
        }
    };

    // GESTIONE DEI CHIP PER I FEATURING
    const handleFeaturingChange = (event: any) => {
        const { value } = event.target;
        setFeaturingIds(typeof value === 'string' ? value.split(',') : value);
    };

    // SALVATAGGIO MODIFICHE (PUT)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const branoAggiornato = {
            nome: nome,
            anno: anno ? parseInt(anno) : 0,
            genere: genere,
            minuti: minuti ? parseInt(minuti) : 0,
            secondi: secondi ? parseInt(secondi) : 0,
            imgUrl: imgUrl,
            autore: { id: autoreId },
            album: albumId ? { id: albumId } : null,
            featuring: featuringIds.map(id => ({ id: id })) 
        };

        try {
            const response = await fetch(`http://localhost:8080/api/brani/${selectedId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(branoAggiornato)
            });

            if (response.ok) {
                alert('Brano modificato con successo!');
                navigate('/admin/brano');
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
                borderRadius: '30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
                alignItems: 'center', backgroundColor: '#5c6b63',
                backgroundImage: `${noisePattern}, linear-gradient(135deg, #5c6b63 0%, #84a293 100%)`,
                backgroundBlendMode: 'overlay, normal'
            }}
        >
            <Box sx={{ width: '100%', maxWidth: '650px', mb: '4vh' }}>
                <Typography
                    onClick={() => navigate('/admin/brano')}
                    sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#000000', fontSize: '1rem', mb: '1vh', cursor: 'pointer', textDecoration: 'underline', '&:hover': { color: '#000000' } }}
                >
                    ← Annulla e torna indietro
                </Typography>
                <Typography variant="h2" component="h1" sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, color: '#000000', letterSpacing: '1px', fontSize: { xs: '2.5rem', md: '3rem' } }}>
                    Modifica Brano
                </Typography>
            </Box>

            {/* SEZIONE 1: SCELTA DEL BRANO DA MODIFICARE */}
            <Paper elevation={0} sx={{ width: '100%', maxWidth: '650px', margin: '0.5vh 3vw 3vh 3vw', padding: { xs: '20px', md: '30px' }, borderRadius: '30px', backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                <FormControl fullWidth sx={customInputStyle}>
                    <InputLabel id="select-brano-label">Seleziona un brano da modificare</InputLabel>
                    <Select
                        labelId="select-brano-label"
                        value={selectedId}
                        label="Seleziona un brano da modificare"
                        onChange={handleSelectChange}
                        sx={{ borderRadius: '12px' }}
                    >
                        {brani.map((brano) => (
                            <MenuItem key={brano.id} value={brano.id}>
                                {brano.nome} {brano.autore ? `(di ${brano.autore.nome})` : ''}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {/* SEZIONE 2: FORM DI MODIFICA */}
            {selectedId && (
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%', maxWidth: '650px', margin: '0.5vh 3vw', padding: { xs: '30px', md: '40px' },
                        borderRadius: '30px', backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        display: 'flex', flexDirection: 'column', gap: '3vh',
                        animation: 'fadeIn 0.5s ease-in-out',
                        '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(-10px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
                    }}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="body1" sx={{ fontFamily: '"Inria Serif", serif', color: '#000000', mb: '1vh', fontSize: '1.1rem' }}>
                        Modifica i dettagli del brano. I campi contrassegnati con * sono obbligatori.
                    </Typography>

                    {/* AUTORE PRINCIPALE */}
                    <FormControl fullWidth required sx={customInputStyle}>
                        <InputLabel id="autore-label">Autore Principale *</InputLabel>
                        <Select
                            labelId="autore-label"
                            value={autoreId}
                            label="Autore Principale *"
                            onChange={(e) => {
                                setAutoreId(e.target.value);
                                setAlbumId(''); // Svuota l'album se cambi l'autore!
                            }}
                            sx={{ borderRadius: '12px' }}
                        >
                            {artisti.map((artista) => (
                                <MenuItem key={`aut-${artista.id}`} value={artista.id}>
                                    {artista.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* ARTISTI OSPITI (FEATURING) */}
                    <FormControl fullWidth sx={customInputStyle}>
                        <InputLabel id="featuring-label">Artisti Ospiti (Featuring)</InputLabel>
                        <Select
                            labelId="featuring-label"
                            multiple
                            value={featuringIds}
                            onChange={handleFeaturingChange}
                            input={<OutlinedInput label="Artisti Ospiti (Featuring)" sx={{ borderRadius: '12px' }} />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const artistaScelto = artisti.find(a => a.id === value);
                                        return <Chip key={value} label={artistaScelto?.nome} />;
                                    })}
                                </Box>
                            )}
                        >
                            {/* Filtriamo l'autore principale per evitare che venga selezionato anche come featuring */}
                            {artisti.filter(a => a.id !== autoreId).map((artista) => (
                                <MenuItem key={`feat-${artista.id}`} value={artista.id}>
                                    {artista.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* ALBUM (FILTRATO IN BASE ALL'AUTORE) */}
                    <FormControl fullWidth sx={customInputStyle} disabled={!autoreId}>
                        <InputLabel id="album-label">
                            {!autoreId ? "Scegli prima un autore..." : "Album di Appartenenza (lascia vuoto se singolo)"}
                        </InputLabel>
                        <Select
                            labelId="album-label"
                            value={albumId}
                            label={!autoreId ? "Scegli prima un autore..." : "Album di Appartenenza (lascia vuoto se singolo)"}
                            onChange={(e) => setAlbumId(e.target.value)}
                            sx={{ borderRadius: '12px' }}
                        >
                            <MenuItem value=""><em>Nessun Album (Singolo)</em></MenuItem>
                            {albums
                                .filter((album) => album.autore && album.autore.id === autoreId)
                                .map((album) => (
                                    <MenuItem key={`alb-${album.id}`} value={album.id}>
                                        {album.nome}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    {/* TITOLO BRANO */}
                    <TextField
                        label="Titolo Brano"
                        variant="outlined"
                        fullWidth
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        sx={customInputStyle}
                    />

                    {/* GENERE E ANNO AFFIANCATI */}
                    <Box sx={{ display: 'flex', gap: '2vw', flexDirection: { xs: 'column', sm: 'row' } }}>
                        <TextField
                            label="Genere"
                            variant="outlined"
                            fullWidth
                            placeholder="Es: Rap, Pop, Rock"
                            value={genere}
                            onChange={(e) => setGenere(e.target.value)}
                            sx={customInputStyle}
                        />
                        <TextField
                            label="Anno"
                            type="number"
                            variant="outlined"
                            fullWidth
                            placeholder="Es: 2024"
                            value={anno}
                            onChange={(e) => setAnno(e.target.value)}
                            slotProps={{ htmlInput: { max: annoCorrente } }}
                            sx={customInputStyle}
                        />
                    </Box>

                    {/* DURATA: MINUTI E SECONDI AFFIANCATI */}
                    <Box sx={{ display: 'flex', gap: '2vw' }}>
                        <TextField
                            label="Minuti"
                            type="number"
                            variant="outlined"
                            fullWidth
                            placeholder="0"
                            value={minuti}
                            onChange={(e) => setMinuti(e.target.value)}
                            slotProps={{ htmlInput: { min: 0 } }}
                            helperText="Inserisci i minuti"
                            sx={customInputStyle}
                        />
                        <TextField
                            label="Secondi"
                            type="number"
                            variant="outlined"
                            fullWidth
                            placeholder="00"
                            value={secondi}
                            onChange={(e) => setSecondi(e.target.value)}
                            slotProps={{ htmlInput: { min: 0, max: 59 } }}
                            helperText="Valore consentito: da 0 a 59"
                            sx={customInputStyle}
                        />
                    </Box>

                    {/* IMMAGINE COPERTINA */}
                    <TextField
                        label="URL Copertina Specifica (lascia vuoto per usare quella dell'album)"
                        type="url"
                        variant="outlined"
                        fullWidth
                        placeholder="https://..."
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                        slotProps={{ htmlInput: { maxLength: 255 } }}
                        sx={customInputStyle}
                    />

                    {/* PREVIEW INTELLIGENTE */}
                    {(imgUrl.startsWith('http') || imgUrl.startsWith('data:')) && (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <Box
                                component="img"
                                src={imgUrl}
                                alt="Preview"
                                sx={{
                                    width: '150px', height: '150px', objectFit: 'cover', borderRadius: '16px',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)', border: '2px solid #000000', backgroundColor: '#f0f0f0'
                                }}
                                onError={(e: any) => { 
                                    e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; 
                                    e.target.alt = '';
                                }}
                            />
                        </Box>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                            mt: '2vh', backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: '12px', padding: '16px', fontSize: '1.2rem',
                            fontFamily: '"Inria Serif", serif', letterSpacing: '1px', textTransform: 'none',
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