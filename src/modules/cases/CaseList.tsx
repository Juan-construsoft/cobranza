import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCases } from './CaseService';
import Table from '../../components/Table';
import { Case } from '../../types';

const columns = [
    { header: 'ID del Caso', accessor: 'id' },
    { header: 'Nombre del Deudor', accessor: 'debtorName' },
    { header: 'Acreedor', accessor: 'creditorName' },
    { header: 'Número de Obligación', accessor: 'obligationNumber' },
    { header: 'Estado', accessor: 'status' },
];

const CaseList: React.FC = () => {
    const history = useHistory();
    const [cases, setCases] = useState<Case[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCases, setFilteredCases] = useState<Case[]>([]);

    useEffect(() => {
        setCases(getCases());
    }, []);

    useEffect(() => {
        setFilteredCases(
            cases.filter(caseItem =>
                caseItem.debtorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                caseItem.id.includes(searchTerm)
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
            <Table
                data={filteredCases}
                columns={columns}
                onRowClick={(row) => history.push(`/cases/${row.id}`)}
            />
        </div>
    );
};

export default CaseList;
