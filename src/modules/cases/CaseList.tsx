import React, { useEffect, useState } from 'react';
import { CaseService } from './CaseService';
import { Table } from '../../components/Table';

const CaseList = () => {
    const [cases, setCases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCases, setFilteredCases] = useState([]);

    useEffect(() => {
        const fetchCases = async () => {
            const caseData = await CaseService.getAllCases();
            setCases(caseData);
        };
        fetchCases();
    }, []);

    useEffect(() => {
        setFilteredCases(
            cases.filter(caseItem =>
                caseItem.debtorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                caseItem.caseId.toString().includes(searchTerm)
            )
        );
    }, [searchTerm, cases]);

    return (
        <div>
            <h1>Listado de Casos</h1>
            <input
                type="text"
                placeholder="Buscar por Nombre Deudor o ID del Caso"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Table data={filteredCases} />
        </div>
    );
};

export default CaseList;