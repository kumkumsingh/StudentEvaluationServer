const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: String,
    imgUrl: String,
    lstClrCode: String,
    evaluationId: {
      type: Schema.Types.ObjectId,
      ref:"Evaluation"
    },
    batch: {
          type: Schema.Types.ObjectId,
          ref: "Batch",
    },
  
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
