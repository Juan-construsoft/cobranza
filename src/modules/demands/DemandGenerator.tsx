import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCaseById } from '../cases/CaseService';
import { generateDemand, downloadDemand } from './DemandService';
import { TemplateSelector } from './TemplateSelector';
import { Case } from '../../types';

const DemandGenerator: React.FC = () => {
    const { caseId } = useParams<{ caseId?: string }>();
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [demandText, setDemandText] = useState('');

    useEffect(() => {
        if (caseId) {
            setCaseData(getCaseById(caseId) ?? null);
        }
    }, [caseId]);

    const handleTemplateSelect = (template: string) => {
        if (caseData) {
            setDemandText(generateDemand(template, caseData));
        }
    };

    const handleDownload = () => {
        downloadDemand(demandText, `demanda-${caseData?.id ?? 'caso'}.txt`);
    };

    return (
        <div>
            <h1>Generador de Demandas</h1>
            {caseData ? (
                <>
                    <h2>Datos del Caso</h2>
                    <p>ID del Caso: {caseData.id}</p>
                    <p>Nombre del Deudor: {caseData.debtorName}</p>
                    <p>Valor Adeudado: {caseData.initialAmount.toLocaleString('es-CO')}</p>
                    <TemplateSelector onTemplateSelect={handleTemplateSelect} />
                    <h2>Borrador de Demanda</h2>
                    <textarea value={demandText} readOnly rows={10} cols={50} />
                    <button onClick={handleDownload} disabled={!demandText}>Descargar Demanda</button>
                </>
            ) : (
                <p>No se encontró el caso. Verifique el ID del caso en la URL.</p>
            )}
        </div>
    );
};

export default DemandGenerator;
