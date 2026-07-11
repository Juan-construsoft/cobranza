import React, { useState } from 'react';

const FileUpload: React.FC<{ onFileUpload: (file: File) => void }> = ({ onFileUpload }) => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

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
        }
    };

    return (
        <div>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload}>Subir Archivos</button>
        </div>
    );
};

export default FileUpload;