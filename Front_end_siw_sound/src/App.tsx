import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material'; 
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ArtistaPage } from './pages/ArtistaPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { GestioneArtistiPage } from './pages/GestioneArtistiPage';
import { InserisciArtistaPage } from './pages/InserisciArtistaPage';
import { ModificaArtistaPage } from './pages/ModificaArtistaPage';
import { EliminaArtistaPage } from './pages/EliminaArtistaPage';
import { AlbumListPage } from './pages/AlbumListPage';
import { AlbumPage } from './pages/AlbumPage';
import { GestioneAlbumsPage } from './pages/GestioneAlbumsPage';
import { InserisciAlbumPage } from './pages/InserisciAlbumPage';
import { ModificaAlbumPage } from './pages/ModificaAlbumPage';
import { EliminaAlbumPage } from './pages/EliminaAlbumPage';
import { BranoListPage } from './pages/BranoListPage';
import { BranoPage } from './pages/BranoPage';
import { GestioneBraniPage } from './pages/GestioneBraniPage';
import { InserisciBranoPage } from './pages/InserisciBranoPage';
import { ModificaBranoPage } from './pages/ModificaBranoPage';
import { EliminaBranoPage } from './pages/EliminaBranoPage';
import { PlaylistListPage } from './pages/PlaylistListPage';
import { InserisciPlaylistPage } from './pages/InserisciPlaylistPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { ProfiloPage } from './pages/ProfiloPage';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline /> 
      <Routes>
        {}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/artisti/:id" element={<ArtistaPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/artista" element={<GestioneArtistiPage />} />
          <Route path="/admin/artista/new" element={<InserisciArtistaPage />} />
          <Route path="/admin/artista/modifica" element={<ModificaArtistaPage />} />
          <Route path="/admin/artista/elimina" element={<EliminaArtistaPage />} />
          <Route path="/albums" element={<AlbumListPage />} />
          <Route path="/albums/:id" element={<AlbumPage />} />
          <Route path="/admin/album" element={<GestioneAlbumsPage />} />
          <Route path="/admin/album/new" element={<InserisciAlbumPage />} />
          <Route path="/admin/album/modifica" element={<ModificaAlbumPage />} />
          <Route path="/admin/album/elimina" element={<EliminaAlbumPage />} />
          <Route path="/brani" element={<BranoListPage />} />
          <Route path="/brani/:id" element={<BranoPage />} />
          <Route path="/admin/brano" element={<GestioneBraniPage/>} />
          <Route path="/admin/brano/new" element={<InserisciBranoPage />} />
          <Route path="/admin/brano/modifica" element={<ModificaBranoPage />} />
          <Route path="/admin/brano/elimina" element={<EliminaBranoPage />} />
          <Route path="/playlists/mie" element={<PlaylistListPage />} />
          <Route path="/playlist/new" element={<InserisciPlaylistPage />} />
          <Route path="/playlists/mie/:id" element={<PlaylistPage />} />
          <Route path="/profilo" element={<ProfiloPage />} />
          {}
        </Route>

        {}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;