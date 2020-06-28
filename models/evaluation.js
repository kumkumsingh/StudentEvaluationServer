const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const evaluationSchema = new Schema(
  {
    evalDate: String ,
    clrCode: String,
    remarks: String,
    studentId: {
         type: Schema.Types.ObjectId,
         ref:"Student"
    }
  },
  
  {
    timestamps: true,
  }
);
evaluationSchema.index({ evalDate: 1, studentId: 1}, { unique: true });
const Evaluation = mongoose.model("Evaluation", evaluationSchema);
module.exports = Evaluation;