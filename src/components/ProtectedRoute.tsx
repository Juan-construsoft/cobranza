import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Redirect to="/login" />;
    }

    return <Route {...rest} component={component} />;
};

export default ProtectedRoute;
