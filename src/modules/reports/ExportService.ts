import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportCasesToCSV = (cases: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(cases);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'cases.csv');
};

export const exportCasesToExcel = (cases: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(cases);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cases');
    XLSX.writeFile(workbook, 'cases.xlsx');
};
