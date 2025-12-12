// app/admin/users/RoleButtons.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";

interface RoleButtonsProps {
  userId: string;
  currentRole: Role;
}

const ROLES: Role[] = ["MEMBER", "LEADER", "ADMIN"];

export function RoleButtons({ userId, currentRole }: RoleButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(role: Role) {
    if (role === currentRole || isPending) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/users/role", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, role }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const message =
            data?.error || "Erro ao atualizar papel do usuário.";
          alert(message);
          return;
        }

        // Atualiza a página sem reload completo
        router.refresh();
      } catch (err) {
        console.error(err);
        alert("Falha de comunicação com o servidor.");
      }
    });
  }

  return (
    <div className="inline-flex gap-2">
      {ROLES.map((role) => {
        const isActive = currentRole === role;

        return (
          <button
            key={role}
            type="button"
            onClick={() => handleChange(role)}
            disabled={isPending || isActive}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              isActive
                ? "border-amber-400 bg-amber-400/10 text-amber-200 cursor-default"
                : "border-white/10 text-gray-300 hover:border-amber-300 hover:text-amber-200"
            } ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {role}
          </button>
        );
      })}
    </div>
  );
}
