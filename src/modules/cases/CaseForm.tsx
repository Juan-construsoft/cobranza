import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { createCase } from './CaseService';
import { uploadCaseDocument } from '../documents/DocumentService';
import { useNotification } from '../../context/NotificationContext';
import CaseFields, { CaseFormValues, emptyCaseValues, valuesToNewCase } from './CaseFields';

const CaseForm: React.FC = () => {
    const history = useHistory();
    const { notify } = useNotification();
    const [values, setValues] = useState<CaseFormValues>(emptyCaseValues);
    const [files, setFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (patch: Partial<CaseFormValues>) => {
        setValues(prev => ({ ...prev, ...patch }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const created = await createCase(valuesToNewCase(values));
            for (const file of files) {
                await uploadCaseDocument(created.id, file);
            }
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
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                        Adjuntar Documentos
                        <input
                            type="file"
                            hidden
                            multiple
                            onChange={e => setFiles([...files, ...Array.from(e.target.files ?? [])])}
                        />
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                        {files.length > 0
                            ? files.map(file => file.name).join(', ')
                            : 'Sin documentos adjuntos'}
                    </Typography>
                </Box>
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
