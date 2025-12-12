// app/api/meetings/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

const meetingSchema = z.object({
  title: z.string().min(3, "Título muito curto"),
  description: z.string().optional(),
  meetingDate: z.string(), // ISO vinda do front
});

// POST: líder/admin registra encontro
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !["LEADER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json(
      { error: "Apenas líderes ou administradores podem registrar encontros." },
      { status: 403 }
    );
  }

  const json = await req.json();
  const parsed = meetingSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, description, meetingDate } = parsed.data;

  const date = new Date(meetingDate);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json(
      { error: "Data inválida." },
      { status: 400 }
    );
  }

  const meeting = await prisma.meeting.create({
    data: {
      leaderId: session.user.id,
      title,
      description,
      meetingDate: date,
    },
  });

  return NextResponse.json(meeting, { status: 201 });
}
