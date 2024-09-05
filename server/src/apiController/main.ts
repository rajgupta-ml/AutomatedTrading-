import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import v1Router  from "./router/v1";
import DatabaseServices from "./services/DatabaseHandler.services";
import { errorHandler } from "./middleware/errorHandler.middleware";
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());


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
    

        const result = await databaseInstance.findOne("users", ["username"], {"userID": "1", "username" : "Raj Gupta"}, ["AND"]);
        console.log('Query Result:', result.rows);

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

