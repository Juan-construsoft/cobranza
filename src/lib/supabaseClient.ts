import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Faltan las variables de entorno REACT_APP_SUPABASE_URL y/o REACT_APP_SUPABASE_ANON_KEY. ' +
            'Copie .env.example a .env.local y llene los valores (Supabase -> Settings -> API).'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
