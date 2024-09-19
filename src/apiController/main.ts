import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import v1Router  from "./router/v1";
import cookieParser from "cookie-parser"
import DatabaseServices from "./services/DatabaseHandler.services";
import { errorHandler } from "./middleware/errorHandler.middleware";
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cookieParser())
app.use(express.json());
// handle ddata sanitization here using a middleware
app.use("/api/v1", v1Router);


app.use(errorHandler);


app.get("/test", (req, res) => {
    res.send("server is working")
})
// Function to initialize both the server and the database
async function startServer() {
    try {
        console.log('Starting server...');
        const databaseInstance = DatabaseServices.getInstance();

        await databaseInstance.connect();

        await databaseInstance.createTableIfNotExist();

        app.listen(PORT, () => {
            console.log(`The server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1); // Exit the process with an error code
    }
}

// Start the server
startServer();

