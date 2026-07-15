import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

const theme = createTheme(
    {
        palette: {
            primary: { main: '#1a3a5c' },
            secondary: { main: '#b58900' },
            background: { default: '#f5f6f8' },
        },
        typography: {
            h4: { fontWeight: 600 },
            h5: { fontWeight: 600 },
        },
    },
    esES
);

export default theme;
