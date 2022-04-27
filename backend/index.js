import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

const logger = (req, res, next) => {
  next();
};
app.use(cors());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
// app.listen(3000, "0.0.0.0", function () {
//   console.log("Listening to port:  " + 3000);
// });
