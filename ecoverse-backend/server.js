const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/travel", require("./routes/travel"));
app.use("/api/electricity", require("./routes/electricity"));
app.use("/api/ml", require("./routes/ml-predictions"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Ecoverse Backend is Running" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌱 Ecoverse Backend running on port ${PORT}`);
});
