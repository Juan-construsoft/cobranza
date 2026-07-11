import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCaseById } from '../cases/CaseService';
import { generateDemand } from './DemandService';
import { TemplateSelector } from './TemplateSelector';

const DemandGenerator = () => {
    const { caseId } = useParams();
    const [caseData, setCaseData] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [demandText, setDemandText] = useState('');

    useEffect(() => {
        const fetchCaseData = async () => {
            const data = await getCaseById(caseId);
            setCaseData(data);
        };
        fetchCaseData();
    }, [caseId]);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        generateDemandText(template);
    };

    const generateDemandText = (template) => {
        if (caseData) {
            const text = template
                .replace('{{nombre_deudor}}', caseData.debtorName)
                .replace('{{valor_adeudado}}', caseData.amountOwed);
            setDemandText(text);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([demandText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'demand.txt';
        link.click();
    };

    return (
        <div>
            <h1>Generador de Demandas</h1>
            {caseData && (
                <>
                    <h2>Datos del Caso</h2>
                    <p>ID del Caso: {caseData.id}</p>
                    <p>Nombre del Deudor: {caseData.debtorName}</p>
                    <p>Valor Adeudado: {caseData.amountOwed}</p>
                    <TemplateSelector onTemplateSelect={handleTemplateSelect} />
                    <h2>Borrador de Demanda</h2>
                    <textarea value={demandText} readOnly rows={10} cols={50} />
                    <button onClick={handleDownload}>Descargar Demanda</button>
                </>
            )}
        </div>
    );
};

export default DemandGenerator;