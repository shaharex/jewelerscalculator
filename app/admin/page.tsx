"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MD } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { type AllowedUser } from "@/lib/supabase";
import { PageShell, PageContent, AppBar, Card, Label, Divider } from "@/components/ui";

function apiFetch(path: string, telegramId: string, options?: RequestInit) {
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-telegram-id": telegramId,
      ...(options?.headers ?? {}),
    },
  });
}

export default function AdminPage() {
  const router  = useRouter();
  const auth    = useAuth();

  const [users,   setUsers]   = useState<AllowedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // Add-user form state
  const [newId,       setNewId]       = useState("");
  const [newPhone,    setNewPhone]    = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newRole,     setNewRole]     = useState<"user" | "admin">("user");
  const [adding,      setAdding]      = useState(false);
  const [addError,    setAddError]    = useState<string | null>(null);

  // Invite form
  const [inviteId,   setInviteId]   = useState("");
  const [inviting,   setInviting]   = useState(false);
  const [inviteMsg,  setInviteMsg]  = useState<string | null>(null);

  const tid = auth.telegramId ?? "";

  function loadUsers() {
    if (!tid) return;
    setLoading(true);
    apiFetch("/api/admin/users", tid)
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Ошибка загрузки"); setLoading(false); });
  }

  useEffect(() => {
    if (auth.status === "allowed" && auth.role === "admin" && tid) loadUsers();
    if (auth.status === "denied") router.replace("/");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.status, auth.role, tid]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newId) { setAddError("Введите Telegram ID"); return; }
    setAdding(true); setAddError(null);
    const res = await apiFetch("/api/admin/users", tid, {
      method: "POST",
      body: JSON.stringify({ telegram_id: newId, phone: newPhone || null, username: newUsername || null, role: newRole }),
    });
    const data = await res.json();
    setAdding(false);
    if (!res.ok) { setAddError(data.error ?? "Ошибка"); return; }
    setNewId(""); setNewPhone(""); setNewUsername("");
    loadUsers();
  }

  async function handleRemove(id: string) {
    if (!confirm("Удалить пользователя?")) return;
    await apiFetch(`/api/admin/users?id=${id}`, tid, { method: "DELETE" });
    loadUsers();
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteId) return;
    setInviting(true); setInviteMsg(null);
    const res = await apiFetch("/api/admin/invite", tid, {
      method: "POST",
      body: JSON.stringify({ telegram_id: inviteId }),
    });
    const data = await res.json();
    setInviting(false);
    setInviteMsg(res.ok ? "✅ Сообщение отправлено" : `❌ ${data.error}`);
  }

  if (auth.status === "loading") {
    return (
      <PageShell>
        <AppBar title="Панель администратора" onBack={() => router.back()} />
        <PageContent>
          <p style={{ color: MD.textLow, textAlign: "center", padding: 32 }}>Загрузка…</p>
        </PageContent>
      </PageShell>
    );
  }

  if (auth.role !== "admin") {
    return (
      <PageShell>
        <AppBar title="Панель администратора" onBack={() => router.back()} />
        <PageContent>
          <Card>
            <p style={{ color: "#E65100", fontWeight: 700, textAlign: "center" }}>Доступ запрещён</p>
          </Card>
        </PageContent>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <AppBar title="Панель администратора" onBack={() => router.back()} />

      <PageContent>
        {/* ── Add user ── */}
        <Card>
          <Label style={{ marginBottom: 12 }}>Добавить пользователя</Label>
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input value={newId} onChange={e => setNewId(e.target.value)} placeholder="Telegram ID (обязательно)"
              style={inputStyle} required />
            <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Телефон (опционально)"
              style={inputStyle} />
            <input value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="@username (опционально)"
              style={inputStyle} />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ color: MD.textMed, fontSize: 13 }}>Роль:</label>
              {(["user", "admin"] as const).map(r => (
                <button key={r} type="button" onClick={() => setNewRole(r)}
                  style={{ padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                    background: newRole === r ? MD.primary : MD.divider,
                    color: newRole === r ? "#fff" : MD.textMed, fontWeight: 600, fontSize: 13 }}>
                  {r}
                </button>
              ))}
            </div>
            {addError && <p style={{ color: "#c00", fontSize: 12, margin: 0 }}>{addError}</p>}
            <button type="submit" disabled={adding}
              style={{ background: MD.primary, color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {adding ? "Добавление…" : "Добавить"}
            </button>
          </form>
        </Card>

        {/* ── Send invite ── */}
        <Card>
          <Label style={{ marginBottom: 12 }}>Отправить приглашение</Label>
          <form onSubmit={handleInvite} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input value={inviteId} onChange={e => setInviteId(e.target.value)}
              placeholder="Telegram ID пользователя" style={inputStyle} />
            {inviteMsg && <p style={{ color: inviteMsg.startsWith("✅") ? "green" : "#c00", fontSize: 13, margin: 0 }}>{inviteMsg}</p>}
            <button type="submit" disabled={inviting}
              style={{ background: "#43A047", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {inviting ? "Отправка…" : "Отправить в Telegram"}
            </button>
          </form>
          <p style={{ color: MD.textLow, fontSize: 11, marginTop: 10, fontStyle: "italic" }}>
            Пользователь должен предварительно запустить вашего бота командой /start
          </p>
        </Card>

        {/* ── User list ── */}
        <Card>
          <Label style={{ marginBottom: 12 }}>Пользователи ({users.length})</Label>
          {loading ? (
            <p style={{ color: MD.textLow, textAlign: "center", padding: 16 }}>Загрузка…</p>
          ) : error ? (
            <p style={{ color: "#c00", textAlign: "center" }}>{error}</p>
          ) : users.length === 0 ? (
            <p style={{ color: MD.textLow, textAlign: "center", padding: 16 }}>Нет пользователей</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {users.map((u, i) => (
                <div key={u.telegram_id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: MD.textHigh, fontWeight: 600, fontSize: 14 }}>
                          {u.username ? `@${u.username}` : u.phone ?? `ID: ${u.telegram_id}`}
                        </span>
                        <span style={{ background: u.role === "admin" ? "#E3F2FD" : MD.primaryLight,
                          color: u.role === "admin" ? "#1565C0" : MD.primary,
                          fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                          {u.role}
                        </span>
                      </div>
                      <span style={{ color: MD.textLow, fontSize: 11 }}>
                        ID: {u.telegram_id}{u.phone ? ` · ${u.phone}` : ""}
                      </span>
                    </div>
                    <button onClick={() => handleRemove(u.telegram_id)}
                      style={{ background: "#FFEBEE", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: "#C62828", fontWeight: 700, fontSize: 12 }}>
                      Удалить
                    </button>
                  </div>
                  {i < users.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}
        </Card>
      </PageContent>
    </PageShell>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: `1px solid ${MD.divider}`,
  fontSize: 14,
  color: MD.textHigh,
  background: MD.bg,
  outline: "none",
  width: "100%",
};
