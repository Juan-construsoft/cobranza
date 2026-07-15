import React from 'react';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { Activity } from '../../types';

interface ActivityHistoryProps {
    activities: Activity[];
}

const formatDate = (date: string): string => {
    const d = new Date(`${date}T00:00:00`);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-CO');
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const deadlineChip = (deadline: string | null) => {
    if (!deadline) return null;
    const days = (new Date(`${deadline}T00:00:00`).getTime() - Date.now()) / MS_PER_DAY;
    const label = formatDate(deadline);
    if (days < 0) return <Chip size="small" color="error" label={label} />;
    if (days <= 3) return <Chip size="small" color="warning" label={label} />;
    return <Chip size="small" label={label} />;
};

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities }) => {
    if (activities.length === 0) {
        return (
            <Typography color="text.secondary" sx={{ my: 2 }}>
                Este caso aún no tiene actuaciones registradas.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper} variant="outlined">
            <MuiTable size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Tipo de Actuación</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Próximo Paso</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Fecha Límite</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.map(activity => (
                        <TableRow key={activity.id}>
                            <TableCell>{activity.type}</TableCell>
                            <TableCell>{formatDate(activity.date)}</TableCell>
                            <TableCell>{activity.description}</TableCell>
                            <TableCell>{activity.nextStep}</TableCell>
                            <TableCell>{deadlineChip(activity.nextStepDeadline)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
};

export default ActivityHistory;
