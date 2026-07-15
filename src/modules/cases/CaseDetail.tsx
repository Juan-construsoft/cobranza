import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getCaseById, updateCase } from './CaseService';
import FileUpload from '../../components/FileUpload';
import { Case } from '../../types';

const CaseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const data = getCaseById(id);
        if (data) {
            setCaseData(data);
        } else {
            setError('No se encontró el caso.');
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCaseData(prev => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSave = () => {
        if (!caseData) {
            return;
        }
        const updated = updateCase(id, caseData);
        if (updated) {
            history.push('/cases');
        } else {
            setError('Error al guardar los datos del caso.');
        }
    };

    if (error) return <div>{error}</div>;
    if (!caseData) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Detalle del Caso</h2>
            <form>
                <div>
                    <label>ID del Caso:</label>
                    <input type="text" name="id" value={caseData.id} readOnly />
                </div>
                <div>
                    <label>Nombre del Deudor:</label>
                    <input type="text" name="debtorName" value={caseData.debtorName} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Número de Obligación:</label>
                    <input type="text" name="obligationNumber" value={caseData.obligationNumber} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Valor Adeudado Inicial:</label>
                    <input type="number" name="initialAmount" value={caseData.initialAmount} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Comentarios Iniciales:</label>
                    <textarea name="initialComments" value={caseData.initialComments} onChange={handleInputChange}></textarea>
                </div>
                <FileUpload onFileUpload={() => { /* Persistencia de documentos pendiente */ }} />
                <button type="button" onClick={handleSave}>Guardar</button>
            </form>
        </div>
    );
};

export default CaseDetail;
