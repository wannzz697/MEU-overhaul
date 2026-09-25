import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/items", async (req, res) => {
  const items = await prisma.item.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      quantity: true,
    },
    orderBy: { name: "asc" },
  });

  res.json(items);
});

router.get("/items/logs", async (req, res) => {
  try {
    const logs = await prisma.conferenceLog.findMany({
      include: {
        user: { select: { name: true, email: true } },
        item: { select: { name: true, code: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ message: "Erro ao buscar histórico de conferências." });
  }
});

router.post("/items/verify", async (req, res) => {
  const { itemId, codeInput } = req.body;

  if (!itemId || !codeInput) {
    return res.status(400).json({
      success: false,
      message: "Informe itemId e codeInput.",
    });
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item não encontrado.",
    });
  }

  const expectedCode = item.code.trim().toUpperCase();
  const receivedCode = String(codeInput).trim().toUpperCase();

  if (expectedCode !== receivedCode) {
    return res.status(400).json({
      success: false,
      message: "Código incorreto para este item.",
    });
  }

  return res.json({ success: true, item });
});

router.post("/items/log", async (req, res) => {
  const { userId, itemId, status } = req.body;

  if (!userId || !itemId || typeof status !== "boolean") {
    return res.status(400).json({
      message: "Informe userId, itemId e status (true ou false).",
    });
  }

  const log = await prisma.conferenceLog.create({
    data: { userId, itemId, status },
  });

  return res.status(201).json(log);
});

router.get("/items/:code", async (req, res) => {
  const { code } = req.params;

  const item = await prisma.item.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!item) {
    return res.status(404).json({ message: "Item não encontrado." });
  }

  res.json(item);
});

router.post("/items", async (req, res) => {
  const { name, code, quantity } = req.body;

  if (!name || !code || typeof quantity !== "number") {
    return res.status(400).json({
      message: "Informe name, code e quantity (número).",
    });
  }

  const codeJaExiste = await prisma.item.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (codeJaExiste) {
    return res.status(400).json({
      message: "Já existe um item cadastrado com esse código.",
    });
  }

  const item = await prisma.item.create({
    data: { name, code: code.trim().toUpperCase(), quantity },
  });

  return res.status(201).json(item);
});

router.put("/items/add-quantity", async (req, res) => {
  const { itemId, amount } = req.body;

  if (!itemId || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({
      message: "Informe itemId e amount (número maior que zero).",
    });
  }

  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) {
    return res.status(404).json({ message: "Item não encontrado." });
  }

  const updatedItem = await prisma.item.update({
    where: { id: itemId },
    data: { quantity: { increment: amount } },
  });

  return res.json(updatedItem);
});

router.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name, code, quantity } = req.body;

  try {
    const itemExistente = await prisma.item.findUnique({ where: { id } });
    if (!itemExistente) {
      return res.status(404).json({ message: "Insumo não encontrado." });
    }

    if (code && code.trim().toUpperCase() !== itemExistente.code) {
      const codeEmUso = await prisma.item.findUnique({
        where: { code: code.trim().toUpperCase() },
      });
      if (codeEmUso) {
        return res.status(400).json({ message: "Já existe outro produto cadastrado com este código." });
      }
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : itemExistente.name,
        code: code !== undefined ? code.trim().toUpperCase() : itemExistente.code,
        quantity: typeof quantity === "number" ? quantity : itemExistente.quantity,
      },
    });

    return res.json(updatedItem);
  } catch (err) {
    return res.status(500).json({ message: "Erro interno ao atualizar insumo." });
  }
});

router.delete("/items/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const itemExistente = await prisma.item.findUnique({ where: { id } });
    if (!itemExistente) {
      return res.status(404).json({ message: "Insumo não encontrado." });
    }

    await prisma.conferenceLog.deleteMany({ where: { itemId: id } });
    await prisma.item.delete({ where: { id } });

    return res.json({ message: "Insumo removido com sucesso." });
  } catch (err) {
    return res.status(500).json({ message: "Erro interno ao remover insumo." });
  }
});

export default router;