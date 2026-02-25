import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Browser-side client (limited by Row Level Security) */
export const supabase = createClient(supabaseUrl, supabaseAnon);

/** Server-side client — bypasses RLS, use ONLY in API routes */
export function supabaseAdmin() {
    return createClient(supabaseUrl, supabaseServiceRole);
}

export type AllowedUser = {
    telegram_id: string;
    phone: string | null;
    username: string | null;
    added_by: string;
    added_at: string;
    role: "user" | "admin";
};
