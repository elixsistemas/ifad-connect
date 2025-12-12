// app/groups/select-leader/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { AppLayout } from "@/app/components/AppLayout";
import { SelectLeaderClient } from "./SelectLeaderClient";

export default async function SelectLeaderPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/groups/select-leader");
  }

  const userId = (session!.user as any).id as string;
  const role = (session!.user as any).role as "MEMBER" | "LEADER" | "ADMIN";

  // Domínio: apenas MEMBER precisa dessa tela
  if (role !== "MEMBER") {
    redirect("/");
  }

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { leaderId: true },
  });

  const leadersFromDb = await prisma.user.findMany({
    where: { role: "LEADER" },
    orderBy: { name: "asc" },
    include: {
      disciples: {
        select: { id: true },
      },
    },
  });

  const leaders = leadersFromDb.map((leader) => ({
    id: leader.id,
    name: leader.name,
    email: leader.email,
    disciplesCount: leader.disciples.length,
  }));

  return (
    <AppLayout>
      <SelectLeaderClient
        leaders={leaders}
        currentLeaderId={me?.leaderId ?? null}
      />
    </AppLayout>
  );
}
