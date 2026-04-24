import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const server = async () => {
  try {
    await connectDB();
    
    app.listen(process.env.PORT, () => {
      console.log(`Backend is running at ${process.env.PORT}`);
    });
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
};

server();