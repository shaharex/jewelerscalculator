import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

/** Validate Telegram WebApp initData HMAC signature */
function validateInitData(initData: string, botToken: string): Record<string, string> | null {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) return null;

    params.delete("hash");

    // Sort keys and build check string
    const checkString = Array.from(params.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join("\n");

    const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
    const calculatedHash = createHmac("sha256", secretKey).update(checkString).digest("hex");

    if (calculatedHash !== hash) return null;

    // Return parsed fields
    const result: Record<string, string> = {};
    params.forEach((v, k) => { result[k] = v; });
    return result;
}

export async function POST(req: NextRequest) {
    try {
        const { initData } = await req.json();
        if (!initData) return NextResponse.json({ allowed: false, error: "No initData" }, { status: 400 });

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) return NextResponse.json({ allowed: false, error: "Server misconfigured" }, { status: 500 });

        // --- DEV MODE: allow bypass when running locally without a real Telegram session ---
        const isDev = process.env.NODE_ENV === "development";
        let telegramId: string;

        if (isDev && initData === "dev_bypass") {
            // In dev, use the first ADMIN_TELEGRAM_IDS entry so you get full access
            const adminIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",").map(s => s.trim()).filter(Boolean);
            telegramId = adminIds[0] ?? "0";
        } else {
            const validated = validateInitData(initData, botToken);
            if (!validated) return NextResponse.json({ allowed: false, error: "Invalid signature" }, { status: 401 });

            const userObj = JSON.parse(validated.user ?? "{}");
            telegramId = String(userObj.id ?? "");
            if (!telegramId) return NextResponse.json({ allowed: false }, { status: 200 });
        }

        // Check if this user is in the admin list (env var, no DB needed for admins)
        const adminIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",").map(s => s.trim());
        const isAdmin = adminIds.includes(telegramId);
        if (isAdmin) {
            return NextResponse.json({ allowed: true, role: "admin", telegramId });
        }

        // Check allowed_users table
        const db = supabaseAdmin();
        const { data, error } = await db
            .from("allowed_users")
            .select("role")
            .eq("telegram_id", telegramId)
            .single();

        if (error || !data) {
            return NextResponse.json({ allowed: false, role: null, telegramId });
        }

        return NextResponse.json({ allowed: true, role: data.role, telegramId });
    } catch (e) {
        console.error("verify error", e);
        return NextResponse.json({ allowed: false, error: "Server error" }, { status: 500 });
    }
}
