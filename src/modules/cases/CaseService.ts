import { supabase } from '../../lib/supabaseClient';
import { caseFromRow, casePatchToRow, caseToRow, CaseRow } from '../../lib/mappers';
import { Case, CaseStatus, NewCase } from '../../types';

const TABLE = 'cases';

export const createCase = async (input: NewCase): Promise<Case> => {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(caseToRow(input))
        .select()
        .single();
    if (error) throw new Error(`No fue posible crear el caso: ${error.message}`);
    return caseFromRow(data as CaseRow);
};

export const getCases = async (): Promise<Case[]> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select()
        .order('last_activity_date', { ascending: false });
    if (error) throw new Error(`No fue posible cargar los casos: ${error.message}`);
    return (data as CaseRow[]).map(caseFromRow);
};

export const getCaseById = async (id: string): Promise<Case | null> => {
    const { data, error } = await supabase.from(TABLE).select().eq('id', id).maybeSingle();
    if (error) throw new Error(`No fue posible cargar el caso: ${error.message}`);
    return data ? caseFromRow(data as CaseRow) : null;
};

export const updateCase = async (id: string, patch: Partial<NewCase>): Promise<Case> => {
    const { data, error } = await supabase
        .from(TABLE)
        .update(casePatchToRow(patch))
        .eq('id', id)
        .select()
        .single();
    if (error) throw new Error(`No fue posible guardar el caso: ${error.message}`);
    return caseFromRow(data as CaseRow);
};

export const deleteCase = async (id: string): Promise<void> => {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) throw new Error(`No fue posible eliminar el caso: ${error.message}`);
};

// Conteos como funciones puras: el Dashboard ya trae los casos, sin roundtrips extra.
export const countActiveCases = (cases: Case[]): number =>
    cases.filter(caseItem => caseItem.status === 'Active').length;

export const countByStatus = (cases: Case[]): Partial<Record<CaseStatus, number>> =>
    cases.reduce<Partial<Record<CaseStatus, number>>>((acc, caseItem) => {
        acc[caseItem.status] = (acc[caseItem.status] ?? 0) + 1;
        return acc;
    }, {});
