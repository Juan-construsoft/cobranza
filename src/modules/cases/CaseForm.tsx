import React, { useState } from 'react';

const CaseForm = ({ onSubmit }) => {
    const [caseData, setCaseData] = useState({
        caseId: '',
        debtorName: '',
        debtorIdType: 'C.C.',
        debtorIdNumber: '',
        debtorAddress: '',
        debtorPhones: '',
        debtorEmails: '',
        creditorName: '',
        obligationNumber: '',
        initialDebtValue: '',
        guaranteeType: [],
        responsibleLawyer: '',
        originalDueDate: '',
        moraStartDate: '',
        initialComments: '',
        documents: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCaseData({
            ...caseData,
            [name]: value
        });
    };

    const handleMultiSelectChange = (e) => {
        const { options } = e.target;
        const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
        setCaseData({
            ...caseData,
            guaranteeType: selectedOptions
        });
    };

    const handleFileChange = (e) => {
        setCaseData({
            ...caseData,
            documents: [...caseData.documents, ...Array.from(e.target.files)]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(caseData);
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