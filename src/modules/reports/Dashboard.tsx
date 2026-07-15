import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getCases, countActiveCases, countByStatus } from '../cases/CaseService';
import { getAllActivities } from '../tracking/ActivityService';
import { checkAlerts } from '../tracking/AlertService';
import { exportCasesToCSV, exportCasesToExcel } from './ExportService';
import { useAsync } from '../../lib/useAsync';
import { Activity, CASE_STATUS_LABELS, CaseStatus } from '../../types';

const Dashboard: React.FC = () => {
    const { data, loading, error } = useAsync(
        () => Promise.all([getCases(), getAllActivities()]),
        []
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) return <Alert severity="error">{error}</Alert>;

    const [cases, activities] = data ?? [[], []];
    const activitiesByCase = activities.reduce<Record<string, Activity[]>>((acc, activity) => {
        (acc[activity.caseId] = acc[activity.caseId] ?? []).push(activity);
        return acc;
    }, {});
    const alerts = checkAlerts(cases, activitiesByCase);
    const byStatus = countByStatus(cases);

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Dashboard</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={() => exportCasesToCSV(cases)}
                        disabled={cases.length === 0}
                    >
                        Exportar CSV
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={() => exportCasesToExcel(cases)}
                        disabled={cases.length === 0}
                    >
                        Exportar Excel
                    </Button>
                </Box>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="primary">
                            {countActiveCases(cases)}
                        </Typography>
                        <Typography color="text.secondary">Casos Activos</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ color: 'warning.main' }}>
                            {alerts.filter(alert => alert.level === 'yellow').length}
                        </Typography>
                        <Typography color="text.secondary">Vencen en ≤ 3 días</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="error">
                            {alerts.filter(alert => alert.level === 'red').length}
                        </Typography>
                        <Typography color="text.secondary">Plazos Vencidos</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Casos por Estado
                        </Typography>
                        {Object.entries(byStatus).map(([status, count]) => (
                            <Typography key={status}>
                                {CASE_STATUS_LABELS[status as CaseStatus]}: {count}
                            </Typography>
                        ))}
                        {cases.length === 0 && (
                            <Typography color="text.secondary">Sin casos registrados.</Typography>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={7}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Alertas de Plazos
                        </Typography>
                        {alerts.length === 0 && (
                            <Typography color="text.secondary">
                                No hay alertas de plazos pendientes.
                            </Typography>
                        )}
                        {alerts.map(alert => (
                            <Alert
                                key={alert.id}
                                severity={alert.level === 'red' ? 'error' : 'warning'}
                                sx={{ mb: 1 }}
                            >
                                <Link component={RouterLink} to={`/cases/${alert.id}`} underline="hover">
                                    {alert.message}
                                </Link>
                            </Alert>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
