import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./config/mongodb.js"

connectDB()


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
