// IMPORTANTE: las uniones literales de este archivo y los enums de
// supabase/schema.sql son espejo uno del otro. Cualquier cambio se hace en AMBOS.

export type CaseStatus =
    | 'Active'
    | 'InLawsuit'
    | 'PaymentAgreement'
    | 'Paid'
    | 'Closed'
    | 'Archived';

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
    Active: 'Activo',
    InLawsuit: 'En Proceso Judicial',
    PaymentAgreement: 'En Acuerdo de Pago',
    Paid: 'Pagado',
    Closed: 'Cerrado',
    Archived: 'Archivado',
};

export const CASE_STATUSES = Object.keys(CASE_STATUS_LABELS) as CaseStatus[];

export const CREDITOR_OPTIONS: string[] = ['Banco A', 'Banco B'];

export type DebtorIdType = 'C.C.' | 'NIT' | 'Pasaporte';

export type GuaranteeType = 'Hipotecaria' | 'Prendaria' | 'Fianza' | 'Personal';

export const GUARANTEE_TYPES: GuaranteeType[] = ['Hipotecaria', 'Prendaria', 'Fianza', 'Personal'];

export interface Case {
    id: string;
    debtorName: string;
    debtorIdType: DebtorIdType;
    debtorIdNumber: string;
    debtorAddress: string;
    debtorPhones: string;
    debtorEmails: string;
    creditorName: string;
    obligationNumber: string;
    initialAmount: number;
    guaranteeType: GuaranteeType[];
    responsibleLawyer: string;
    originalDueDate: string; // YYYY-MM-DD
    startDateOfDelinquency: string; // YYYY-MM-DD
    initialComments: string;
    status: CaseStatus;
    lastActivityDate: string; // ISO timestamptz
    createdAt?: string; // ISO timestamptz
}

export type NewCase = Omit<Case, 'id' | 'lastActivityDate' | 'createdAt'>;

export type ActivityType =
    | 'Demanda Radicada'
    | 'Auto Admisorio'
    | 'Auto Inadmisorio'
    | 'Notificación Realizada'
    | 'Respuesta Demanda'
    | 'Audiencia Agendada'
    | 'Audiencia Realizada'
    | 'Sentencia Emitida'
    | 'Recurso Presentado'
    | 'Medida Cautelar Decretada'
    | 'Embargo Realizado'
    | 'Remate Realizado'
    | 'Pago Recibido'
    | 'Caso Archivado';

export const ACTIVITY_TYPES: ActivityType[] = [
    'Demanda Radicada',
    'Auto Admisorio',
    'Auto Inadmisorio',
    'Notificación Realizada',
    'Respuesta Demanda',
    'Audiencia Agendada',
    'Audiencia Realizada',
    'Sentencia Emitida',
    'Recurso Presentado',
    'Medida Cautelar Decretada',
    'Embargo Realizado',
    'Remate Realizado',
    'Pago Recibido',
    'Caso Archivado',
];

export interface Activity {
    id: string;
    caseId: string;
    type: ActivityType;
    date: string; // YYYY-MM-DD
    description: string;
    nextStep: string;
    nextStepDeadline: string | null; // YYYY-MM-DD
    relatedDocument?: string | null; // path dentro del bucket case-documents
}

export type NewActivity = Omit<Activity, 'id'>;
