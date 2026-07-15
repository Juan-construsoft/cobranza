import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { getCases, countActiveCases, countByStatus } from '../cases/CaseService';
import { useAsync } from '../../lib/useAsync';
import { CASE_STATUS_LABELS, CaseStatus } from '../../types';

const Dashboard: React.FC = () => {
    const { data: cases, loading, error } = useAsync(getCases, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) return <Alert severity="error">{error}</Alert>;

    const allCases = cases ?? [];
    const byStatus = countByStatus(allCases);

    return (
        <div>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Dashboard
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="primary">
                            {countActiveCases(allCases)}
                        </Typography>
                        <Typography color="text.secondary">Casos Activos</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Casos por Estado
                        </Typography>
                        {Object.entries(byStatus).map(([status, count]) => (
                            <Typography key={status}>
                                {CASE_STATUS_LABELS[status as CaseStatus]}: {count}
                            </Typography>
                        ))}
                        {allCases.length === 0 && (
                            <Typography color="text.secondary">Sin casos registrados.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
