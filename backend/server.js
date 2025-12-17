import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./utils/mongoConfig.js";
import threadRoute from "./routes/threadRoute.js";
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

// middelwares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://nexa-us55.onrender.com"], // Your Vite dev server
    credentials: true,
  })
);

// routes
app.use("/api/thread", threadRoute);

app.get("/", (req, res) => {
  res.send("Hey");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
