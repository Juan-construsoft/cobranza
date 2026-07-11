import { saveAs } from 'file-saver';
import { parse } from 'json2csv';

export const exportCasesToCSV = (cases: any[]) => {
    const csv = parse(cases);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'cases.csv');
};

export const exportCasesToExcel = (cases: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(cases);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cases');
    XLSX.writeFile(workbook, 'cases.xlsx');
};