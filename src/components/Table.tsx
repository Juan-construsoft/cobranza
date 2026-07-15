import React from 'react';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface TableProps {
    data: Array<Record<string, any>>;
    columns: Array<{ header: string; accessor: string; render?: (row: Record<string, any>) => React.ReactNode }>;
    onRowClick?: (row: Record<string, any>) => void;
}

const Table: React.FC<TableProps> = ({ data, columns, onRowClick }) => {
    return (
        <TableContainer component={Paper}>
            <MuiTable size="small">
                <TableHead>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell key={column.accessor} sx={{ fontWeight: 700 }}>
                                {column.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow
                            key={row.id ?? rowIndex}
                            hover={Boolean(onRowClick)}
                            onClick={() => onRowClick && onRowClick(row)}
                            sx={onRowClick ? { cursor: 'pointer' } : undefined}
                        >
                            {columns.map(column => (
                                <TableCell key={column.accessor}>
                                    {column.render ? column.render(row) : row[column.accessor]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
};

export default Table;
