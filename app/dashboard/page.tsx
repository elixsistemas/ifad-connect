// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardRedirectPage() {
  const session = await getServerSession(authOptions);

  // se não estiver logado, manda pro login (e depois volta pra /dashboard)
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const role = session.user.role;

  if (role === "ADMIN") {
    redirect("/admin"); // ou /admin, se você criar um dashboard geral
  }

  if (role === "LEADER") {
    redirect("/leader");
  }

  // qualquer outro papel cai como MEMBER
  redirect("/member");
}
