import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import v1Router  from "./router/v1";
import DatabaseManager from "./services/DatabaseHandler.services";
import { errorHandler } from "./middleware/errorHandler.middleware";
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());


app.use("/api/v1", v1Router);


app.use(errorHandler);


app.get("/test", (req, res) => {
    res.send("server is working")
})
app.listen(PORT, async () => {
    console.log(`The server is running on http://localhost:${PORT}`);
    const databaseInstance = DatabaseManager.getInstance();
    await databaseInstance.connect()
})

