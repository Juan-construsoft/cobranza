import { Case } from '../../types';

const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-CO');
};

export const generateDemand = (template: string, caseData: Case): string => {
    const replacements: Record<string, string> = {
        '{{id_caso}}': caseData.id,
        '{{nombre_deudor}}': caseData.debtorName,
        '{{tipo_identificacion}}': caseData.debtorIdType,
        '{{numero_identificacion}}': caseData.debtorIdNumber,
        '{{direccion}}': caseData.debtorAddress,
        '{{telefonos}}': caseData.debtorPhones,
        '{{correos}}': caseData.debtorEmails,
        '{{nombre_acreedor}}': caseData.creditorName,
        '{{numero_obligacion}}': caseData.obligationNumber,
        '{{valor_adeudado}}': caseData.initialAmount.toLocaleString('es-CO'),
        '{{tipo_garantia}}': caseData.guaranteeType.join(', '),
        '{{abogado_responsable}}': caseData.responsibleLawyer,
        '{{fecha_vencimiento}}': formatDate(caseData.originalDueDate),
        '{{fecha_inicio_mora}}': formatDate(caseData.startDateOfDelinquency),
        '{{comentarios}}': caseData.initialComments,
    };

    return Object.entries(replacements).reduce(
        (text, [placeholder, value]) => text.split(placeholder).join(value),
        template
    );
};

export const downloadDemand = (demandText: string, fileName: string = 'demanda.txt'): void => {
    const blob = new Blob([demandText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
};
