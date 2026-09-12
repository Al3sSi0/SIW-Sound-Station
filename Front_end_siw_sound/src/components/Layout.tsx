import React from 'react';
import { Box, Paper, Typography, IconButton, Divider } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home'; 
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { isAuthenticated, username } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profilo');
    } else {
      navigate('/register');
    }
  };

  const menuItems = [
    { label: 'ARTISTI', path: 'http://localhost:8080/artisti', isExternal: true },
    { label: 'ALBUMS', path: '/albums', isExternal: false },
    { label: 'BRANI', path: '/brani', isExternal: false },
    { label: 'LE MIE PLAYLISTS', path: '/playlists/mie', isExternal: false },
    { label: 'PANNELLO ADMIN', path: '/admin', isExternal: false },
    { label: '', path: '', isExternal: false },
  ];

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'transparent' }}>
      
      <Paper
        elevation={6}
        sx={{ 
          width: '100%', 
          height: '14vh', 
          borderRadius: '0 0 24px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          px: '4vw', 
          zIndex: 10 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '3vw' }}>
          <IconButton 
            onClick={() => navigate('/')} 
            sx={{ 
              color: '#2c3e50',
              padding: '8px',
              transition: 'transform 0.2s',
              '&:hover': { 
                transform: 'scale(1.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <HomeIcon sx={{ fontSize: '2.6rem' }} />
          </IconButton>
          
          <Typography
            variant="h3"
            onClick={() => navigate('/')}
            sx={{ 
              fontFamily: '"Inria Serif", serif', 
              fontWeight: 700, 
              color: '#2c3e50', 
              letterSpacing: '2px', 
              fontSize: '4rem', 
              cursor: 'pointer' 
            }}
          >
            SOUND STATION ROMA3
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
          <Typography variant="h6" sx={{ fontSize: '2.5rem', fontFamily: '"Inria Serif", serif', fontWeight: 400, color: '#2c3e50' }}>
            {isAuthenticated ? username : 'Ospite'}
          </Typography>
          <IconButton onClick={handleProfileClick} sx={{ color: '#222' }}>
            <AccountCircleIcon sx={{ fontSize: '3.2rem' }} />
          </IconButton>
        </Box>
      </Paper>

      <Box sx={{ flex: 1, display: 'flex', position: 'relative', width: '100%', height: '86vh' }}>
        
        <Paper
          elevation={6}
          sx={{ width: '18vw', height: '100%', mt: '3vh', borderRadius: '0 24px 24px 0', display: 'flex', flexDirection: 'column', zIndex: 10, overflow: 'hidden' }}
        >
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <Box
                onClick={() => {
                  if (item.path) {
                    if (item.isExternal) {
                      window.location.href = item.path;
                    } else {
                      navigate(item.path);
                    }
                  }
                }}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  px: '2vw',
                  cursor: item.path ? 'pointer' : 'default',
                  backgroundColor: location.pathname === item.path ? 'rgba(0,0,0,0.2)' : 'transparent',
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: item.path ? 'rgba(0,0,0,0.05)' : 'transparent' },
                }}
              >
                <Typography sx={{ fontFamily: '"Inria Serif", serif', fontWeight: 700, fontSize: '1.2rem', color: '#2c3e50', lineHeight: 1.2 }}>
                  {item.label}
                </Typography>
              </Box>
              {index < menuItems.length - 1 && <Divider sx={{ borderColor: '#2c3e50', opacity: 0.3 }} />}
            </React.Fragment>
          ))}
        </Paper>

        <Box sx={{ flex: 1, height: '86vh', position: 'relative' }}>
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
}