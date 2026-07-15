import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import DownloadIcon from '@mui/icons-material/Download';
import { getCaseById } from '../cases/CaseService';
import { useAsync } from '../../lib/useAsync';
import { generateDemand, downloadDemand } from './DemandService';
import { TemplateSelector } from './TemplateSelector';

const DemandGenerator: React.FC = () => {
    const { caseId } = useParams<{ caseId?: string }>();
    const { data: caseData, loading, error } = useAsync(
        () => (caseId ? getCaseById(caseId) : Promise.resolve(null)),
        [caseId]
    );
    const [demandText, setDemandText] = useState('');

    const handleTemplateSelect = (template: string) => {
        if (caseData) {
            setDemandText(generateDemand(template, caseData));
        }
    };

    const handleDownload = () => {
        downloadDemand(demandText, `demanda-${caseData?.id ?? 'caso'}.txt`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!caseData) {
        return (
            <Alert severity="warning">
                No se encontró el caso. Abra el generador desde el detalle de un caso.
            </Alert>
        );
    }

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Generador de Demandas
            </Typography>
            <Typography sx={{ mb: 0.5 }}>
                <strong>Deudor:</strong> {caseData.debtorName}
            </Typography>
            <Typography sx={{ mb: 2 }}>
                <strong>Valor Adeudado:</strong> ${caseData.initialAmount.toLocaleString('es-CO')}
            </Typography>
            <TemplateSelector onTemplateSelect={handleTemplateSelect} />
            <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
                Borrador de Demanda
            </Typography>
            <TextField
                value={demandText}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                minRows={12}
                placeholder="Seleccione una plantilla para generar el borrador."
            />
            <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={!demandText}
                sx={{ mt: 2 }}
            >
                Descargar Demanda
            </Button>
        </Paper>
    );
};

export default DemandGenerator;
