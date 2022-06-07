import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRotes.js";
import accountRoutes from "./routes/accountRoutes.js";
import currencyRoutes from "./routes/currencyRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT;
const app = express();

const logger = (req, res, next) => {
  next();
};
app.use(cors());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/currencies", currencyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// ***Below code to run on other device beside, the local***

// app.listen(3000, "0.0.0.0", function () {
//   console.log("Listening to port:  " + 3000);
// });

// ***Above code to run on other device beside, the local***
