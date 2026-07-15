import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Case, CASE_STATUS_LABELS } from '../../types';

const toExportRow = (caseItem: Case) => ({
    'Deudor': caseItem.debtorName,
    'Tipo de Identificación': caseItem.debtorIdType,
    'Número de Identificación': caseItem.debtorIdNumber,
    'Dirección': caseItem.debtorAddress,
    'Teléfonos': caseItem.debtorPhones,
    'Correos': caseItem.debtorEmails,
    'Acreedor': caseItem.creditorName,
    'Número de Obligación': caseItem.obligationNumber,
    'Valor Adeudado Inicial': caseItem.initialAmount,
    'Tipos de Garantía': caseItem.guaranteeType.join(', '),
    'Abogado Responsable': caseItem.responsibleLawyer,
    'Fecha de Vencimiento Original': caseItem.originalDueDate,
    'Fecha de Inicio de Mora': caseItem.startDateOfDelinquency,
    'Estado': CASE_STATUS_LABELS[caseItem.status],
    'Última Actividad': caseItem.lastActivityDate,
    'Comentarios Iniciales': caseItem.initialComments,
});

export const exportCasesToCSV = (cases: Case[]): void => {
    const worksheet = XLSX.utils.json_to_sheet(cases.map(toExportRow));
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    // BOM para que Excel abra el CSV con acentos correctos
    const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'casos.csv');
};

export const exportCasesToExcel = (cases: Case[]): void => {
    const worksheet = XLSX.utils.json_to_sheet(cases.map(toExportRow));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Casos');
    XLSX.writeFile(workbook, 'casos.xlsx');
};
