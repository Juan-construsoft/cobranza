import { supabase } from '../../lib/supabaseClient';
import { activityFromRow, activityToRow, ActivityRow } from '../../lib/mappers';
import { Activity, NewActivity } from '../../types';

const TABLE = 'activities';

// El trigger activities_touch_case de la DB actualiza last_activity_date
// del caso al insertar; no hace falta una segunda llamada desde el front.
export const createActivity = async (input: NewActivity): Promise<Activity> => {
    const { data, error } = await supabase
        .from(TABLE)
        .insert(activityToRow(input))
        .select()
        .single();
    if (error) throw new Error(`No fue posible registrar la actuación: ${error.message}`);
    return activityFromRow(data as ActivityRow);
};

export const getActivitiesByCase = async (caseId: string): Promise<Activity[]> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select()
        .eq('case_id', caseId)
        .order('date', { ascending: false });
    if (error) throw new Error(`No fue posible cargar las actuaciones: ${error.message}`);
    return (data as ActivityRow[]).map(activityFromRow);
};

export const getAllActivities = async (): Promise<Activity[]> => {
    const { data, error } = await supabase.from(TABLE).select();
    if (error) throw new Error(`No fue posible cargar las actuaciones: ${error.message}`);
    return (data as ActivityRow[]).map(activityFromRow);
};
