import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { createCase } from './CaseService';
import { useNotification } from '../../context/NotificationContext';
import CaseFields, { CaseFormValues, emptyCaseValues, valuesToNewCase } from './CaseFields';

const CaseForm: React.FC = () => {
    const history = useHistory();
    const { notify } = useNotification();
    const [values, setValues] = useState<CaseFormValues>(emptyCaseValues);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (patch: Partial<CaseFormValues>) => {
        setValues(prev => ({ ...prev, ...patch }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const created = await createCase(valuesToNewCase(values));
            notify('Caso creado correctamente.', 'success');
            history.push(`/cases/${created.id}`);
        } catch (err) {
            notify(err instanceof Error ? err.message : 'Error al crear el caso.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Apertura de Caso
            </Typography>
            <form onSubmit={handleSubmit}>
                <CaseFields values={values} onChange={handleChange} />
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Guardando…' : 'Guardar Caso'}
                    </Button>
                    <Button onClick={() => history.push('/cases')}>Cancelar</Button>
                </Box>
            </form>
        </Paper>
    );
};

export default CaseForm;
