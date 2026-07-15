import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const FileUpload: React.FC<{ onFileUpload: (file: File) => void }> = ({ onFileUpload }) => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(event.target.files);
        }
    };

    const handleUpload = () => {
        if (selectedFiles) {
            Array.from(selectedFiles).forEach(file => {
                onFileUpload(file);
            });
            setSelectedFiles(null);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                Seleccionar Archivos
                <input ref={inputRef} type="file" hidden multiple onChange={handleFileChange} />
            </Button>
            <Typography variant="body2" color="text.secondary">
                {selectedFiles && selectedFiles.length > 0
                    ? `${selectedFiles.length} archivo(s) seleccionado(s)`
                    : 'Ningún archivo seleccionado'}
            </Typography>
            <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!selectedFiles || selectedFiles.length === 0}
            >
                Subir Archivos
            </Button>
        </Box>
    );
};

export default FileUpload;
