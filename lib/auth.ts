"use client";

import { useEffect, useState } from "react";

export type AuthStatus = "loading" | "allowed" | "denied";
export type UserRole = "admin" | "user" | null;

export interface AuthResult {
    status: AuthStatus;
    role: UserRole;
    telegramId: string | null;
}

/** Get the raw Telegram WebApp initData string */
function getInitData(): string {
    if (typeof window === "undefined") return "";
    // @ts-expect-error Telegram types not globally declared
    return window?.Telegram?.WebApp?.initData ?? "";
}

/**
 * Verifies the current Telegram user against the server.
 * In dev mode (NODE_ENV=development) with no initData present,
 * sends a "dev_bypass" token so you can test locally.
 */
export function useAuth(): AuthResult {
    const [result, setResult] = useState<AuthResult>({
        status: "loading",
        role: null,
        telegramId: null,
    });

    useEffect(() => {
        let initData = getInitData();

        // Dev bypass — no real Telegram session in localhost browser
        if (!initData && process.env.NODE_ENV === "development") {
            initData = "dev_bypass";
        }

        if (!initData) {
            setResult({ status: "denied", role: null, telegramId: null });
            return;
        }

        fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData }),
        })
            .then(r => r.json())
            .then(data => {
                setResult({
                    status: data.allowed ? "allowed" : "denied",
                    role: data.role ?? null,
                    telegramId: data.telegramId ?? null,
                });
            })
            .catch(() => {
                setResult({ status: "denied", role: null, telegramId: null });
            });
    }, []);

    return result;
}
