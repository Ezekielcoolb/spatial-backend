const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      
    },
    lastName: {
      type: String,
      required: true,
     
    },
    email: {
      type: String,
      required: true,
     
    },
    phoneNumber: {
      type: String,
     
    },
    message: {
      type: String,
      required: true,
     
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("UserMessage", messageSchema);
