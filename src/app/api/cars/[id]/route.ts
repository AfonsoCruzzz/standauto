import { NextResponse } from "next/server";
import { prisma } from '../../../../../lib/prisma'
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../app/auth"; // Ajusta o import conforme o teu projeto

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params; // <--- AQUI ESTÁ A CORREÇÃO (o await)
  const id = params.id;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
  }

  try {
    const { isFeatured } = await req.json();

    const updatedCar = await prisma.car.update({
      where: { id }, // Usamos o id extraído
      data: { isFeatured },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("Erro no PATCH:", error);
    return NextResponse.json({ message: "Erro ao atualizar carro" }, { status: 500 });
  }
}