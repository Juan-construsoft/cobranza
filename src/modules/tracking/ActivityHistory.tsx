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
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getSignedUrl } from '../documents/DocumentService';
import { useNotification } from '../../context/NotificationContext';
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
    // Vencido al terminar el día límite (hora local), igual que AlertService.
    const days = (new Date(`${deadline}T23:59:59`).getTime() - Date.now()) / MS_PER_DAY;
    const label = formatDate(deadline);
    if (days < 0) return <Chip size="small" color="error" label={label} />;
    if (days <= 3) return <Chip size="small" color="warning" label={label} />;
    return <Chip size="small" label={label} />;
};

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities }) => {
    const { notify } = useNotification();

    const handleOpenDocument = async (path: string) => {
        try {
            const url = await getSignedUrl(path);
            window.open(url, '_blank', 'noopener');
        } catch (err) {
            notify(err instanceof Error ? err.message : 'Error al abrir el documento.', 'error');
        }
    };

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
                        <TableCell sx={{ fontWeight: 700 }}>Documento</TableCell>
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
                            <TableCell>
                                {activity.relatedDocument && (
                                    <IconButton
                                        size="small"
                                        aria-label="abrir documento"
                                        onClick={() => handleOpenDocument(activity.relatedDocument!)}
                                    >
                                        <OpenInNewIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
};

export default ActivityHistory;
