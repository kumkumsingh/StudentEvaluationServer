const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new Schema(
  {
    batchName: String,
    stDate: Date,
    endDate: Date,
    students: {
      type: [{
       type: Schema.Types.ObjectId,
       ref: 'Student'
    }],
    default:[]
  }
  },
  {
    timestamps: true,
  }
);

const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;
