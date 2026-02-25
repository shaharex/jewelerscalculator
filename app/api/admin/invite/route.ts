import { NextRequest, NextResponse } from "next/server";

/** POST /api/admin/invite — send a Telegram bot message to a known user */
export async function POST(req: NextRequest) {
    const callerIds = (process.env.ADMIN_TELEGRAM_IDS ?? "").split(",").map(s => s.trim());
    const callerId = req.headers.get("x-telegram-id") ?? "";
    if (!callerIds.includes(callerId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { telegram_id } = await req.json();
    if (!telegram_id) return NextResponse.json({ error: "telegram_id required" }, { status: 400 });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return NextResponse.json({ error: "Bot token not set" }, { status: 500 });

    const text = "✅ Вам предоставлен доступ к приложению Ювелирные Калькуляторы. Нажмите кнопку ниже, чтобы открыть его.";

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: telegram_id,
            text,
            reply_markup: {
                inline_keyboard: [[
                    { text: "Открыть приложение 💎", url: process.env.NEXT_PUBLIC_APP_URL ?? "https://t.me" }
                ]],
            },
        }),
    });

    const result = await res.json();
    if (!result.ok) return NextResponse.json({ error: result.description }, { status: 400 });
    return NextResponse.json({ ok: true });
}
