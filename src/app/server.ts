import express from "express";
import { createRouter } from "./routes/index.js";

const app = express();
app.use(express.json());

// Register routes with dependencies
const { router, prisma } = createRouter();

app.use("/api", router);

// Graceful shutdown
process.on("SIGINT", () => {
  prisma.$disconnect()
    .then(() => process.exit())
    .catch(() => process.exit(1));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
