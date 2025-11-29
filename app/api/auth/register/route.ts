// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser, findUserByEmail } from "@/app/services/user";

const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await findUserByEmail(data.email);
    if (existing) {
      return NextResponse.json(
        { error: "E-mail já cadastrado" },
        { status: 400 }
      );
    }

    await createUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error("Erro no register:", err);
    // Se for erro de validação do Zod
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", issues: err.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao registrar usuário" },
      { status: 500 }
    );
  }
}
