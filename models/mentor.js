import { ObjectId } from "bson";
import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    mentor_name: {
      type: String,
      required: true,
      trim: true,
    },
    mentor_email: { type: String, required: true, trim: true },
    students: [
      {
        type: ObjectId,
        ref: "students",
      },
    ],
  },
  { timestamps: true }
);

const Mentors = mongoose.model("mentors", mentorSchema);
export { Mentors };
