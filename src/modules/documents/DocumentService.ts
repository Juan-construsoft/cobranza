import { supabase } from '../../lib/supabaseClient';

const BUCKET = 'case-documents';

export interface CaseDocument {
    name: string;
    path: string;
}

// Los archivos de un caso viven bajo cases/{caseId}/ dentro del bucket privado.
export const uploadCaseDocument = async (caseId: string, file: File): Promise<string> => {
    const path = `cases/${caseId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) throw new Error(`No fue posible subir el documento "${file.name}": ${error.message}`);
    return path;
};

export const listCaseDocuments = async (caseId: string): Promise<CaseDocument[]> => {
    const { data, error } = await supabase.storage.from(BUCKET).list(`cases/${caseId}`);
    if (error) throw new Error(`No fue posible listar los documentos: ${error.message}`);
    return (data ?? [])
        .filter(item => item.name)
        .map(item => ({ name: item.name, path: `cases/${caseId}/${item.name}` }));
};

export const getSignedUrl = async (path: string, expiresInSeconds = 3600): Promise<string> => {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresInSeconds);
    if (error || !data) throw new Error(`No fue posible generar el enlace del documento: ${error?.message}`);
    return data.signedUrl;
};

export const deleteDocument = async (path: string): Promise<void> => {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw new Error(`No fue posible eliminar el documento: ${error.message}`);
};
