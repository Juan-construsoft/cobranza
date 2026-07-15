import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createCase } from './CaseService';
import { Case } from '../../types';

type DebtorIdType = Case['debtorIdType'];
type CreditorName = Case['creditorName'];
type GuaranteeType = Case['guaranteeType'];

interface CaseFormState {
    caseId: string;
    debtorName: string;
    debtorIdType: DebtorIdType;
    debtorIdNumber: string;
    debtorAddress: string;
    debtorPhones: string;
    debtorEmails: string;
    creditorName: string;
    obligationNumber: string;
    initialDebtValue: string;
    guaranteeType: string[];
    responsibleLawyer: string;
    originalDueDate: string;
    moraStartDate: string;
    initialComments: string;
    documents: File[];
}

const initialState: CaseFormState = {
    caseId: '',
    debtorName: '',
    debtorIdType: 'C.C.',
    debtorIdNumber: '',
    debtorAddress: '',
    debtorPhones: '',
    debtorEmails: '',
    creditorName: 'Banco A',
    obligationNumber: '',
    initialDebtValue: '',
    guaranteeType: [],
    responsibleLawyer: 'Abogado 1',
    originalDueDate: '',
    moraStartDate: '',
    initialComments: '',
    documents: [],
};

interface CaseFormProps {
    onSubmit?: (caseData: Case) => void;
}

const toCase = (formData: CaseFormState): Case => ({
    id: formData.caseId,
    debtorName: formData.debtorName,
    debtorIdType: formData.debtorIdType,
    debtorIdNumber: formData.debtorIdNumber,
    debtorAddress: formData.debtorAddress,
    debtorPhones: formData.debtorPhones,
    debtorEmails: formData.debtorEmails,
    creditorName: formData.creditorName as CreditorName,
    obligationNumber: formData.obligationNumber,
    initialAmount: Number(formData.initialDebtValue) || 0,
    guaranteeType: formData.guaranteeType as GuaranteeType,
    responsibleLawyer: formData.responsibleLawyer,
    originalDueDate: formData.originalDueDate,
    startDateOfDelinquency: formData.moraStartDate,
    initialComments: formData.initialComments,
    status: 'Active',
    lastActivityDate: new Date().toISOString(),
});

const CaseForm: React.FC<CaseFormProps> = ({ onSubmit }) => {
    const history = useHistory();
    const [caseData, setCaseData] = useState<CaseFormState>(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCaseData({
            ...caseData,
            [name]: value,
        });
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.options)
            .filter(option => option.selected)
            .map(option => option.value);
        setCaseData({
            ...caseData,
            guaranteeType: selectedOptions,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCaseData({
            ...caseData,
            documents: [...caseData.documents, ...Array.from(e.target.files ?? [])],
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newCase = toCase(caseData);
        if (onSubmit) {
            onSubmit(newCase);
        } else {
            createCase(newCase);
            history.push('/cases');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="caseId" placeholder="ID del Caso" value={caseData.caseId} onChange={handleChange} required />
            <input type="text" name="debtorName" placeholder="Nombre del Deudor" value={caseData.debtorName} onChange={handleChange} required />
            <select name="debtorIdType" value={caseData.debtorIdType} onChange={handleChange}>
                <option value="C.C.">C.C.</option>
                <option value="NIT">NIT</option>
                <option value="Pasaporte">Pasaporte</option>
            </select>
            <input type="text" name="debtorIdNumber" placeholder="Número de Identificación" value={caseData.debtorIdNumber} onChange={handleChange} required />
            <input type="text" name="debtorAddress" placeholder="Dirección" value={caseData.debtorAddress} onChange={handleChange} />
            <textarea name="debtorPhones" placeholder="Teléfonos" value={caseData.debtorPhones} onChange={handleChange} />
            <textarea name="debtorEmails" placeholder="Correos" value={caseData.debtorEmails} onChange={handleChange} />
            <select name="creditorName" value={caseData.creditorName} onChange={handleChange} required>
                <option value="Banco A">Banco A</option>
                <option value="Banco B">Banco B</option>
            </select>
            <input type="text" name="obligationNumber" placeholder="Número de Obligación" value={caseData.obligationNumber} onChange={handleChange} required />
            <input type="number" name="initialDebtValue" placeholder="Valor Adeudado Inicial" value={caseData.initialDebtValue} onChange={handleChange} required />
            <select multiple name="guaranteeType" value={caseData.guaranteeType} onChange={handleMultiSelectChange}>
                <option value="Hipotecaria">Hipotecaria</option>
                <option value="Prendaria">Prendaria</option>
                <option value="Fianza">Fianza</option>
                <option value="Personal">Personal</option>
            </select>
            <select name="responsibleLawyer" value={caseData.responsibleLawyer} onChange={handleChange} required>
                <option value="Abogado 1">Abogado 1</option>
                <option value="Abogado 2">Abogado 2</option>
            </select>
            <input type="date" name="originalDueDate" value={caseData.originalDueDate} onChange={handleChange} />
            <input type="date" name="moraStartDate" value={caseData.moraStartDate} onChange={handleChange} />
            <textarea name="initialComments" placeholder="Comentarios Iniciales" value={caseData.initialComments} onChange={handleChange} />
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit">Guardar Caso</button>
        </form>
    );
};

export default CaseForm;
