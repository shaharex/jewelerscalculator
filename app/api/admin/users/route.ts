import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/** Verify caller is admin from their telegramId header */
function isAdmin(req: NextRequest): boolean {
    const callerIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",").map(s => s.trim());
    const callerId = req.headers.get("x-telegram-id") ?? "";
    return callerIds.includes(callerId);
}

/** GET /api/admin/users — list all allowed users */
export async function GET(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const db = supabaseAdmin();
    const { data, error } = await db.from("allowed_users").select("*").order("added_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

/** POST /api/admin/users — add a user { telegram_id, phone?, username?, role? } */
export async function POST(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const callerIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",").map(s => s.trim());
    const callerId = req.headers.get("x-telegram-id") ?? callerIds[0] ?? "0";

    const body = await req.json();
    const { telegram_id, phone, username, role = "user" } = body;

    if (!telegram_id) return NextResponse.json({ error: "telegram_id is required" }, { status: 400 });

    const db = supabaseAdmin();
    const { data, error } = await db
        .from("allowed_users")
        .upsert({
            telegram_id: String(telegram_id),
            phone: phone ?? null,
            username: username ?? null,
            role,
            added_by: callerId,
            added_at: new Date().toISOString(),
        }, { onConflict: "telegram_id" })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

/** DELETE /api/admin/users?id=TELEGRAM_ID — remove a user */
export async function DELETE(req: NextRequest) {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const db = supabaseAdmin();
    const { error } = await db.from("allowed_users").delete().eq("telegram_id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
