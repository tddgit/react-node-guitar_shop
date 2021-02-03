const mongoose = require("mongoose");

const woodSchema = mongoose.Schema({
  name: {
    required: true,
    unique: 1,
    type: String,
    maxlength: 100,
  },
});

exports.Wood = mongoose.model("Wood", woodSchema);
