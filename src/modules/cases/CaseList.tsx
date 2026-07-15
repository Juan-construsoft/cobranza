import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import { getCases } from './CaseService';
import { useAsync } from '../../lib/useAsync';
import Table from '../../components/Table';
import { Case, CASE_STATUS_LABELS } from '../../types';

const columns = [
    { header: 'Deudor', accessor: 'debtorName' },
    { header: 'Identificación', accessor: 'debtorIdNumber' },
    { header: 'Acreedor', accessor: 'creditorName' },
    { header: 'Número de Obligación', accessor: 'obligationNumber' },
    {
        header: 'Valor Inicial',
        accessor: 'initialAmount',
        render: (row: Record<string, any>) =>
            `$${(row as Case).initialAmount.toLocaleString('es-CO')}`,
    },
    {
        header: 'Estado',
        accessor: 'status',
        render: (row: Record<string, any>) => (
            <Chip size="small" label={CASE_STATUS_LABELS[(row as Case).status]} />
        ),
    },
];

const CaseList: React.FC = () => {
    const history = useHistory();
    const { data: cases, loading, error } = useAsync(getCases, []);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCases = useMemo(() => {
        if (!cases) return [];
        const term = searchTerm.toLowerCase();
        return cases.filter(
            caseItem =>
                caseItem.debtorName.toLowerCase().includes(term) ||
                caseItem.debtorIdNumber.includes(searchTerm) ||
                caseItem.obligationNumber.includes(searchTerm)
        );
    }, [cases, searchTerm]);

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Listado de Casos</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => history.push('/cases/new')}
                >
                    Nuevo Caso
                </Button>
            </Box>
            <TextField
                placeholder="Buscar por deudor, identificación o número de obligación"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
            />
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
                <>
                    <Table
                        data={filteredCases}
                        columns={columns}
                        onRowClick={row => history.push(`/cases/${row.id}`)}
                    />
                    {filteredCases.length === 0 && (
                        <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                            No hay casos registrados{searchTerm ? ' que coincidan con la búsqueda' : ''}.
                        </Typography>
                    )}
                </>
            )}
        </div>
    );
};

export default CaseList;
