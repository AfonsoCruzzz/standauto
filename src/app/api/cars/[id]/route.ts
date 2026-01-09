import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma"; // Confirma se este import está a funcionar, ou usa o teu relativo
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth"; // Confirma se este import está a funcionar

// --- PATCH: Serve para VENDER (isAvailable) e para DESTACAR (isFeatured) ---
export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> } // ✅ A forma correta (Next.js 15)
) {
  const params = await props.params; // ✅ Fazemos o await como tinhas bem feito
  const id = params.id;

  const session = await getServerSession(authOptions);

  // Verificação de segurança
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
  }

  try {
    // CORREÇÃO CRÍTICA AQUI:
    // Antes estavas a fazer: const { isFeatured } = await req.json();
    // Isso ignorava o "isAvailable". Agora lemos o corpo todo:
    const body = await req.json(); 

    const updatedCar = await prisma.car.update({
      where: { id },
      data: body, // ✅ Agora aceita { isFeatured: true } OU { isAvailable: false }
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("Erro no PATCH:", error);
    return NextResponse.json({ message: "Erro ao atualizar carro" }, { status: 500 });
  }
}

// --- DELETE: Apagar Carro Definitivamente ---
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> } // ✅ Corrigido para igualar o PATCH
) {
  const params = await props.params; // ✅ Await obrigatório agora
  const id = params.id;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.car.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Carro apagado com sucesso" });
  } catch (error) {
    console.error("Erro no DELETE:", error);
    return NextResponse.json({ message: "Erro ao apagar carro" }, { status: 500 });
  }
}