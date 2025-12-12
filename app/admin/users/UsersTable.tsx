// app/admin/users/UsersTable.tsx
"use client";

import { useMemo, useState } from "react";
import type { Role } from "@prisma/client";
import { RoleButtons } from "./RoleButtons";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isOnline: boolean;
  lastLoginAt: string | null; // ISO string
};

type Props = {
  users: UserRow[];
};

const roleLabels: Record<Role, string> = {
  MEMBER: "Membro",
  LEADER: "Líder",
  ADMIN: "Admin",
};

export function UsersTable({ users }: Props) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | Role>("ALL");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return users.filter((u) => {
      const matchesText =
        q.length === 0 ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

      return matchesText && matchesRole;
    });
  }, [users, query, roleFilter]);

  return (
    <div className="space-y-4">
      {/* barra de filtro */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full bg-slate-900/60 border border-white/10 px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 hidden sm:inline">
            Filtrar por papel:
          </span>
          {(["ALL", "MEMBER", "LEADER", "ADMIN"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={
                "rounded-full px-3 py-1 border text-[11px] transition " +
                (roleFilter === r
                  ? "border-amber-400 bg-amber-400/10 text-amber-200"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-amber-300 hover:text-amber-200")
              }
            >
              {r === "ALL" ? "Todos" : roleLabels[r as Role]}
            </button>
          ))}
        </div>
      </div>

      {/* info de contagem */}
      <p className="text-xs text-gray-500">
        Exibindo <span className="text-gray-200">{filtered.length}</span> de{" "}
        <span className="text-gray-200">{users.length}</span> usuários.
      </p>

      {/* tabela */}
      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/5">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left text-gray-400">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Papel</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const lastLoginLabel = user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString("pt-BR")
                : "—";

              return (
                <tr key={user.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-gray-100">
                    {user.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{user.email}</td>

                  {/* Status + último login */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={
                          "inline-flex h-2.5 w-2.5 rounded-full " +
                          (user.isOnline ? "bg-emerald-400" : "bg-red-500")
                        }
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline text-gray-200">
                        {user.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                    <span className="mt-1 block text-[11px] text-gray-400">
                      Último login: {lastLoginLabel}
                    </span>
                  </td>

                  {/* Papel atual */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-amber-300">
                      {user.role}
                    </span>
                  </td>

                  {/* Botões de troca de papel */}
                  <td className="px-4 py-3 text-right">
                    <RoleButtons userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-xs text-gray-500"
                >
                  Nenhum usuário encontrado para os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
