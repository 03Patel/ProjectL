import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  dateTime: {
    type: Date,
    required: true,
  },
  imageUrl: String,
  status: {
    type: String,
    enum: ["upcoming", "completed"],
    default: "upcoming",
  },
  notifyBeforeMins: {
    type: Number,
    default: 30,
  },
}, { timestamps: true });

const Event = mongoose.model("Event", EventSchema);
export default Event;
