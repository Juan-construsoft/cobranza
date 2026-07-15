import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUpload from '../../components/FileUpload';
import { useAsync } from '../../lib/useAsync';
import { useNotification } from '../../context/NotificationContext';
import {
    deleteDocument,
    getSignedUrl,
    listCaseDocuments,
    uploadCaseDocument,
} from './DocumentService';

interface DocumentsSectionProps {
    caseId: string;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ caseId }) => {
    const { notify } = useNotification();
    const { data: documents, loading, error, reload } = useAsync(
        () => listCaseDocuments(caseId),
        [caseId]
    );
    const [busy, setBusy] = useState(false);

    const handleUpload = async (file: File) => {
        setBusy(true);
        try {
            await uploadCaseDocument(caseId, file);
            notify(`Documento "${file.name}" subido.`, 'success');
            reload();
        } catch (err) {
            notify(err instanceof Error ? err.message : 'Error al subir el documento.', 'error');
        } finally {
            setBusy(false);
        }
    };

    const handleOpen = async (path: string) => {
        try {
            const url = await getSignedUrl(path);
            window.open(url, '_blank', 'noopener');
        } catch (err) {
            notify(err instanceof Error ? err.message : 'Error al abrir el documento.', 'error');
        }
    };

    const handleDelete = async (path: string) => {
        setBusy(true);
        try {
            await deleteDocument(path);
            notify('Documento eliminado.', 'success');
            reload();
        } catch (err) {
            notify(err instanceof Error ? err.message : 'Error al eliminar el documento.', 'error');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={28} />
                </Box>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
                <>
                    {(documents ?? []).length === 0 && (
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                            Este caso no tiene documentos.
                        </Typography>
                    )}
                    <List dense>
                        {(documents ?? []).map(doc => (
                            <ListItem
                                key={doc.path}
                                secondaryAction={
                                    <>
                                        <IconButton
                                            edge="end"
                                            aria-label="abrir"
                                            onClick={() => handleOpen(doc.path)}
                                        >
                                            <OpenInNewIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="eliminar"
                                            onClick={() => handleDelete(doc.path)}
                                            disabled={busy}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                }
                            >
                                <ListItemText primary={doc.name} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
            <FileUpload onFileUpload={handleUpload} />
        </div>
    );
};

export default DocumentsSection;
