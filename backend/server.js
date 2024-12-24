const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoute = require("./routes/dashboard");
const goals = require("./routes/goals")
const trendRoutes = require("./routes/trendRoutes")

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Mongodb Connected"))
.catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/goals", goals);
app.use("/api", trendRoutes);


// const jwtSecret = process.env.JWT_SECRET;
// console.log("JWT Secret:", jwtSecret);

app.listen(process.env.PORT, () => 
    console.log(`server running on port ${process.env.PORT}`)
);