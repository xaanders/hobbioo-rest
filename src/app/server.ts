import express, { NextFunction, Request, Response } from "express";
import { createRouter } from "./routes/index.js";
import { prismaErrorHandler } from "./db/prisma-error-handler.js";

const app = express();
app.use(express.json());

// Register routes with dependencies
const { router, prisma } = createRouter();

app.use("/api", router);

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit()
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});