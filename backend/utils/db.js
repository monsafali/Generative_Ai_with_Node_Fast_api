const mongoose = require("mongoose");
require("dotenv").config();
exports.dbconnection = async () => {
  try {
    const dbconnect = await mongoose.connect(process.env.MONGO_URL);
    console.log(dbconnect.connection.host);
  } catch (error) {
    console.log("Something went wrong");
    process.exit(1);
  }
};
