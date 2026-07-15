import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import GavelIcon from '@mui/icons-material/Gavel';

const navItems = [
    { label: 'Dashboard', to: '/' },
    { label: 'Casos', to: '/cases' },
    { label: 'Nuevo Caso', to: '/cases/new' },
];

const Layout: React.FC = ({ children }) => {
    const location = useLocation();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static">
                <Toolbar>
                    <GavelIcon sx={{ mr: 1.5 }} />
                    <Typography variant="h6" sx={{ mr: 4 }}>
                        Gestor de Cobranza
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                        {navItems.map(item => (
                            <Button
                                key={item.to}
                                component={RouterLink}
                                to={item.to}
                                color="inherit"
                                sx={{
                                    opacity: location.pathname === item.to ? 1 : 0.75,
                                    fontWeight: location.pathname === item.to ? 700 : 400,
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {children}
            </Container>
        </Box>
    );
};

export default Layout;
