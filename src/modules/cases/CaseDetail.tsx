import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { getCaseById, updateCase, deleteCase } from './CaseService';
import { uploadCaseDocument } from '../documents/DocumentService';
import DocumentsSection from '../documents/DocumentsSection';
import { createActivity, getActivitiesByCase } from '../tracking/ActivityService';
import ActivityForm, { ActivityFormData } from '../tracking/ActivityForm';
import ActivityHistory from '../tracking/ActivityHistory';
import { useAsync } from '../../lib/useAsync';
import { useNotification } from '../../context/NotificationContext';
import CaseFields, { CaseFormValues, valuesFromCase, valuesToNewCase } from './CaseFields';

const CaseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { notify } = useNotification();
    const { data: caseData, loading, error, reload: reloadCase } = useAsync(() => getCaseById(id), [id]);
    const {
        data: activities,
        loading: activitiesLoading,
        error: activitiesError,
        reload: reloadActivities,
    } = useAsync(() => getActivitiesByCase(id), [id]);
    const [values, setValues] = useState<CaseFormValues | null>(null);
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [registeringActivity, setRegisteringActivity] = useState(false);

    useEffect(() => {
        if (caseData) {
            setValues(valuesFromCase(caseData));
        }
    }, [caseData]);

    const handleChange = (patch: Partial<CaseFormValues>) => {
        setValues(prev => (prev ? { ...prev, ...patch } : prev));
    };

    const handleSave = async () => {
        if (!values) return;
        setSaving(true);
        try {
            await updateCase(id, valuesToNewCase(values));
            notify('Caso guardado correctamente.', 'success');
        } catch (err) {
            notify(err instanceof Error ? err.message : 'Error al guardar el caso.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleRegisterActivity = async (activityData: ActivityFormData) => {
        setRegisteringActivity(true);
        try {
            const { document, ...fields } = activityData;
            const relatedDocument = document ? await uploadCaseDocument(id, document) : null;
            await createActivity({ ...fields, relatedDocument, caseId: id });
            notify('Actuación registrada correctamente.', 'success');
            reloadActivities();
            reloadCase();
        } catch (err) {
            notify(err instanceof Error ? err.message : 'Error al registrar la actuación.', 'error');
        } finally {
            setRegisteringActivity(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteCase(id);
            notify('Caso eliminado.', 'success');
            history.push('/cases');
        } catch (err) {
            notify(err instanceof Error ? err.message : 'Error al eliminar el caso.', 'error');
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!caseData || !values) return <Alert severity="warning">No se encontró el caso.</Alert>;

    return (
        <div>
            <Paper sx={{ p: 4, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Detalle del Caso</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<DescriptionIcon />}
                            onClick={() => history.push(`/demands/${id}`)}
                        >
                            Generar Demanda
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setConfirmDelete(true)}
                        >
                            Eliminar
                        </Button>
                    </Box>
                </Box>
                <CaseFields values={values} onChange={handleChange} showStatus />
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={handleSave} disabled={saving}>
                        {saving ? 'Guardando…' : 'Guardar Cambios'}
                    </Button>
                    <Button onClick={() => history.push('/cases')}>Volver al Listado</Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 4, mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Documentos del Caso
                </Typography>
                <DocumentsSection caseId={id} />
            </Paper>

            <Paper sx={{ p: 4, mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Registrar Actuación
                </Typography>
                <ActivityForm onSubmit={handleRegisterActivity} submitting={registeringActivity} />
            </Paper>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Historial de Actuaciones
                </Typography>
                {activitiesLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <CircularProgress size={28} />
                    </Box>
                )}
                {activitiesError && <Alert severity="error">{activitiesError}</Alert>}
                {!activitiesLoading && !activitiesError && (
                    <ActivityHistory activities={activities ?? []} />
                )}
            </Paper>

            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>¿Eliminar este caso?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Se eliminará el caso de {caseData.debtorName} y todas sus actuaciones
                        registradas. Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>Cancelar</Button>
                    <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
                        {deleting ? 'Eliminando…' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CaseDetail;
