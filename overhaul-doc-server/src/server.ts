import express from "express";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes";
import userRoutes from "./routes/userRoutes";
import metaRoutes from "./routes/metaRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api", metaRoutes);

const PORT = 3000;
const HOST = "0.0.0.0"; 

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://10.4.0.203:${PORT}`);
  console.log(`Também acessível localmente em http://localhost:${PORT}`);
});
