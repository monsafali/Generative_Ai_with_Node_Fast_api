const express = require("express");
const cors = require("cors");
const router = require("./router/chat.router");
const { dbconnection } = require("./utils/db.js");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/chats", router);

app.listen(PORT, () => {
  dbconnection();
  console.log("Backed running on", PORT);
});
