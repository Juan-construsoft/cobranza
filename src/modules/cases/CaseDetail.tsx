import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import CaseService from './CaseService';
import FileUpload from '../../components/FileUpload';

const CaseDetail = () => {
    const { caseId } = useParams();
    const history = useHistory();
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                const data = await CaseService.getCaseById(caseId);
                setCaseData(data);
            } catch (err) {
                setError('Error fetching case data');
            } finally {
                setLoading(false);
            }
        };

        fetchCaseData();
    }, [caseId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCaseData({ ...caseData, [name]: value });
    };

    const handleSave = async () => {
        try {
            await CaseService.updateCase(caseId, caseData);
            history.push('/cases');
        } catch (err) {
            setError('Error saving case data');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Detalle del Caso</h2>
            <form>
                <div>
                    <label>ID del Caso:</label>
                    <input type="text" name="caseId" value={caseData.caseId} readOnly />
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
                <FileUpload caseId={caseId} />
                <button type="button" onClick={handleSave}>Guardar</button>
            </form>
        </div>
    );
};

export default CaseDetail;