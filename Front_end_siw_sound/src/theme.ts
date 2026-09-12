import { createTheme } from '@mui/material/styles';

const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.60'/%3E%3C/svg%3E")`;

export const customTheme = createTheme({
  palette: {
    primary: { main: '#d4efe2' },
  },
  typography: {
    fontFamily: '"Inria Serif", serif',
    h4: { fontWeight: 700 },
    body1: { fontWeight: 400 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { margin: 0, padding: 0, height: '100%' },
        body: {
          margin: 0,
          padding: 0,
          height: '100%',
          background: 'linear-gradient(135deg, #1d1d1d 0%, #545454 100%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #d4efe2 inset !important',
            WebkitTextFillColor: '#2c3e50 !important',
            transition: 'background-color 5000s ease-in-out 0s',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#d4efe2',
          backgroundImage: noiseTexture,
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#d4efe2',
          backgroundImage: noiseTexture,
          fontFamily: '"Inria Serif", serif',
          fontWeight: 700,
          color: '#2c3e50',
          border: '1px solid rgba(0,0,0,0.15)',
          '&:hover': { backgroundColor: '#c2e2d3', filter: 'brightness(0.95)' },
        },
      },
    },
  },
});