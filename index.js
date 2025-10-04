const express = require("express");
const cors = require("cors");
const qs = require("qs");
const path = require("path");
const dotenv = require('dotenv');
const uploadRoute = require("./routes/uploadRoutes");
const homeRoute = require("./routes/homeRoutes");
const aboutRoute = require("./routes/aboutRoutes")
const projectRoute = require("./routes/projectRoutes")
const generalRoute = require("./routes/generalRoutes")
const serviceRoute = require("./routes/serviceRoutes")
const messageRoute = require("./routes/messageRoutes")
const userRoute = require("./routes/userRoutes")
const connectDB = require("./config/config");

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors()); // ✅ enable CORS globally
app.use(express.json());

// Static route for uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
    },
  })
);


// API routes
app.use(uploadRoute);
app.use('/api/home', homeRoute);
app.use('/api/about', aboutRoute);
app.use('/api/project', projectRoute);
app.use('/api/service', serviceRoute);
app.use('/api/general', generalRoute);
app.use('/api/messages', messageRoute);
app.use('/api/adminAuth', userRoute)

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
