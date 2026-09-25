import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const router = Router();
const prisma = new PrismaClient();

router.get("/first", async (req, res) => {
  const user = await prisma.user.findFirst();

  if (!user) {
    return res.status(404).json({
      message: "Nenhum usuário cadastrado. Rode 'npm run seed' no backend.",
    });
  }

  const { password, ...userSemSenha } = user;
  res.json(userSemSenha);
});

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Erro ao buscar usuários." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "E-mail ou senha inválidos." });
  }

  const senhaCorreta = await bcrypt.compare(password, user.password);
  if (!senhaCorreta) {
    return res.status(401).json({ message: "E-mail ou senha inválidos." });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: role === "ADMIN" ? "ADMIN" : "USER"
      }
    });

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao registrar usuário." });
  }
});

router.put("/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["USER", "ADMIN"].includes(role)) {
    return res.status(400).json({ message: "Permissão inválida." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: String(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: "Erro ao atualizar permissão do usuário." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.conferenceLog.deleteMany({
      where: { userId: String(id) }
    });

    await prisma.user.delete({ 
      where: { id: String(id) }
    });

    return res.json({ message: "Usuário removido com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    return res.status(500).json({ message: "Erro ao remover usuário do banco de dados." });
  }
});

export default router;