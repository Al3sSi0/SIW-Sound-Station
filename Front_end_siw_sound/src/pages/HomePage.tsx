
import React from 'react';
import { Box, Typography } from '@mui/material';

export function HomePage() {
    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: '15vh'
        }}>
            <Typography
                variant="h3"
                align="center"
                sx={{
                    fontFamily: '"Inria Serif", serif',
                    fontWeight: 700,
                    fontSize: '450%',
                    color: '#d4efe2',
                    textShadow: '4px 4px 10px rgba(0,0,0,0.7)',
                    lineHeight: 1.4,
                    letterSpacing: '10px',
                    zIndex: 5
                }}
            >
                BENVENUTO NELLA CASA <br /> DELLA MUSICA MONDIALE
            </Typography>

            <Box component="img" src="/images/Adele.png"
                alt="Singer Left"
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: '2vw',
                    height: 'auto',
                    maxHeight: '50vh',
                    maxWidth: '32vw',
                    opacity: 0.6,
                    mixBlendMode: 'lighten',
                    zIndex: 1,
                    pointerEvents: 'none'
                }} />
            <Box component="img" src="/images/FreddyMercury.png"
                alt="Singer Right"
                sx={{
                    position: 'absolute',
                    bottom: '5vh',
                    right: '2vw',
                    height: 'auto',
                    maxHeight: '110vh',
                    maxWidth: '40vw',
                    opacity: 0.4,
                    mixBlendMode: 'lighten',
                    zIndex: 1,
                    pointerEvents: 'none'
                }} />
        </Box>
    );
}




