// src/app/server.ts
import express from 'express';
import type { Request, Response } from 'express';
// import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());

// Register routes
app.use("/users", (req: Request, res: Response) => {res.send("Hello World")});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
