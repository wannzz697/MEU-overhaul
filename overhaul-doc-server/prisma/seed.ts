import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.conferenceLog.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();
  await prisma.meta.deleteMany();

  const senhaCriptografada = await bcrypt.hash("123456", 10);

  const user = await prisma.user.create({
    data: {
      name: "Thomas Gleisson",
      email: "thomas@alltak.com.br",
      password: senhaCriptografada,
      role: "ADMIN",
    },
  });

  await prisma.item.createMany({
    data: [
      { name: "Cola Branca 500ml", code: "COL-500", quantity: 150 },
      { name: "Fita Adesiva 50mm", code: "FIT-050", quantity: 80 },
      { name: "Verniz PU", code: "VER-PU1", quantity: 45 },
      { name: "Solvente X", code: "SOL-X01", quantity: 120 },
      { name: "Etiqueta Padrão", code: "ETQ-STD", quantity: 504 },
    ],
  });

  const meta = await prisma.meta.create({
    data: { id: "meta", value: 1000 },
  });

  console.log("Seed concluído.");
  console.log("Usuário criado:", user);
  console.log("Meta inicial criada:", meta);
}

main()
  .catch((error) => {
    console.error("Erro ao popular o banco:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
