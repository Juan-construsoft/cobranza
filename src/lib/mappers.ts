import {
    Activity,
    Case,
    CaseStatus,
    DebtorIdType,
    GuaranteeType,
    NewActivity,
    NewCase,
    ActivityType,
} from '../types';

// Filas snake_case tal como las devuelve Supabase (tablas public.cases / public.activities).

export interface CaseRow {
    id: string;
    debtor_name: string;
    debtor_id_type: DebtorIdType;
    debtor_id_number: string;
    debtor_address: string;
    debtor_phones: string;
    debtor_emails: string;
    creditor_name: string;
    obligation_number: string;
    initial_amount: number;
    guarantee_type: GuaranteeType[];
    responsible_lawyer: string;
    original_due_date: string;
    start_date_of_delinquency: string;
    initial_comments: string;
    status: CaseStatus;
    last_activity_date: string;
    created_at: string;
}

export type CaseRowInsert = Omit<CaseRow, 'id' | 'last_activity_date' | 'created_at'>;

export interface ActivityRow {
    id: string;
    case_id: string;
    type: ActivityType;
    date: string;
    description: string;
    next_step: string;
    next_step_deadline: string | null;
    related_document: string | null;
    created_at: string;
}

export type ActivityRowInsert = Omit<ActivityRow, 'id' | 'created_at'>;

export const caseFromRow = (row: CaseRow): Case => ({
    id: row.id,
    debtorName: row.debtor_name,
    debtorIdType: row.debtor_id_type,
    debtorIdNumber: row.debtor_id_number,
    debtorAddress: row.debtor_address,
    debtorPhones: row.debtor_phones,
    debtorEmails: row.debtor_emails,
    creditorName: row.creditor_name,
    obligationNumber: row.obligation_number,
    initialAmount: Number(row.initial_amount),
    guaranteeType: row.guarantee_type ?? [],
    responsibleLawyer: row.responsible_lawyer,
    originalDueDate: row.original_due_date,
    startDateOfDelinquency: row.start_date_of_delinquency,
    initialComments: row.initial_comments,
    status: row.status,
    lastActivityDate: row.last_activity_date,
    createdAt: row.created_at,
});

export const caseToRow = (input: NewCase): CaseRowInsert => ({
    debtor_name: input.debtorName,
    debtor_id_type: input.debtorIdType,
    debtor_id_number: input.debtorIdNumber,
    debtor_address: input.debtorAddress,
    debtor_phones: input.debtorPhones,
    debtor_emails: input.debtorEmails,
    creditor_name: input.creditorName,
    obligation_number: input.obligationNumber,
    initial_amount: input.initialAmount,
    guarantee_type: input.guaranteeType,
    responsible_lawyer: input.responsibleLawyer,
    original_due_date: input.originalDueDate,
    start_date_of_delinquency: input.startDateOfDelinquency,
    initial_comments: input.initialComments,
    status: input.status,
});

export const casePatchToRow = (patch: Partial<NewCase>): Partial<CaseRowInsert> => {
    const row: Partial<CaseRowInsert> = {};
    if (patch.debtorName !== undefined) row.debtor_name = patch.debtorName;
    if (patch.debtorIdType !== undefined) row.debtor_id_type = patch.debtorIdType;
    if (patch.debtorIdNumber !== undefined) row.debtor_id_number = patch.debtorIdNumber;
    if (patch.debtorAddress !== undefined) row.debtor_address = patch.debtorAddress;
    if (patch.debtorPhones !== undefined) row.debtor_phones = patch.debtorPhones;
    if (patch.debtorEmails !== undefined) row.debtor_emails = patch.debtorEmails;
    if (patch.creditorName !== undefined) row.creditor_name = patch.creditorName;
    if (patch.obligationNumber !== undefined) row.obligation_number = patch.obligationNumber;
    if (patch.initialAmount !== undefined) row.initial_amount = patch.initialAmount;
    if (patch.guaranteeType !== undefined) row.guarantee_type = patch.guaranteeType;
    if (patch.responsibleLawyer !== undefined) row.responsible_lawyer = patch.responsibleLawyer;
    if (patch.originalDueDate !== undefined) row.original_due_date = patch.originalDueDate;
    if (patch.startDateOfDelinquency !== undefined) row.start_date_of_delinquency = patch.startDateOfDelinquency;
    if (patch.initialComments !== undefined) row.initial_comments = patch.initialComments;
    if (patch.status !== undefined) row.status = patch.status;
    return row;
};

export const activityFromRow = (row: ActivityRow): Activity => ({
    id: row.id,
    caseId: row.case_id,
    type: row.type,
    date: row.date,
    description: row.description,
    nextStep: row.next_step,
    nextStepDeadline: row.next_step_deadline,
    relatedDocument: row.related_document,
});

export const activityToRow = (input: NewActivity): ActivityRowInsert => ({
    case_id: input.caseId,
    type: input.type,
    date: input.date,
    description: input.description,
    next_step: input.nextStep,
    next_step_deadline: input.nextStepDeadline,
    related_document: input.relatedDocument ?? null,
});
