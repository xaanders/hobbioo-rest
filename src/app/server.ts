import express from "express";
import userRoutes from "./routes/user-routes.js";

const app = express();
app.use(express.json());


// Register routes with dependencies
app.use("/users", userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});