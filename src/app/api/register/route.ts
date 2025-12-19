import { NextResponse } from "next/server";
// Ajusta o caminho conforme a localização real do teu ficheiro prisma.ts
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Dados em falta" }, { status: 400 });
    }

    // Verifica se já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ message: "Email já registado" }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do user sempre como CLIENT
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT", 
      },
    });

    return NextResponse.json({ message: "Conta criada com sucesso!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro no servidor", error }, { status: 500 });
  }
}