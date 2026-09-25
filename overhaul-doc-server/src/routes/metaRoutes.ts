import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

const META_ID = "meta";

router.get("/meta", async (req, res) => {
  try {
    let meta = await prisma.meta.findUnique({ where: { id: META_ID } });

    if (!meta) {
      meta = await prisma.meta.create({
        data: { id: META_ID, value: 0 },
      });
    }

    return res.json(meta);
  } catch (err) {
    return res.status(500).json({ message: "Erro ao buscar a Meta." });
  }
});

router.put("/meta", async (req, res) => {
  const { value, role } = req.body;

  if (role !== "ADMIN") {
    return res.status(403).json({
      message: "Apenas o ADMIN pode alterar a Meta.",
    });
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    return res.status(400).json({ message: "Informe um valor numérico para a Meta." });
  }

  try {
    const meta = await prisma.meta.upsert({
      where: { id: META_ID },
      update: { value },
      create: { id: META_ID, value },
    });

    return res.json(meta);
  } catch (err) {
    return res.status(500).json({ message: "Erro ao atualizar a Meta." });
  }
});

export default router;
