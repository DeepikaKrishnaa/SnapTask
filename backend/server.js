import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5050;

const server = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Backend is running at ${PORT}`);
    });
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
};

server();