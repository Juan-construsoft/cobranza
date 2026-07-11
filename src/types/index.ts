export interface Case {
    id: string;
    debtorName: string;
    debtorIdType: 'C.C.' | 'NIT' | 'Pasaporte';
    debtorIdNumber: string;
    debtorAddress: string;
    debtorPhones: string;
    debtorEmails: string;
    creditorName: 'Banco A' | 'Banco B'; // Add more as needed
    obligationNumber: string;
    initialAmount: number;
    guaranteeType: Array<'Hipotecaria' | 'Prendaria' | 'Fianza' | 'Personal'>;
    responsibleLawyer: string;
    originalDueDate: Date;
    startDateOfDelinquency: Date;
    initialComments: string;
    status: string; // e.g., 'Active', 'Closed', etc.
    lastActivityDate: Date;
}

export interface Activity {
    type: 'Demanda Radicada' | 'Auto Admisorio' | 'Auto Inadmisorio' | 'Notificación Realizada' | 'Respuesta Demanda' | 'Audiencia Agendada' | 'Audiencia Realizada' | 'Sentencia Emitida' | 'Recurso Presentado' | 'Medida Cautelar Decretada' | 'Embargo Realizado' | 'Remate Realizado' | 'Pago Recibido' | 'Caso Archivado';
    date: Date;
    description: string;
    nextStep: string;
    nextStepDeadline: Date;
    relatedDocument?: string; // URL or path to the document
}

export interface Report {
    totalActiveCases: number;
    casesByStatus: Record<string, number>;
    alertYellowCount: number;
    alertRedCount: number;
}