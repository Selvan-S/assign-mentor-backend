import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    student_name: {
      type: String,
      required: true,
      trim: true,
    },
    student_email: {
      type: String,
      required: true,
      trim: true,
    },
    student_course: {
      type: String,
      required: true,
      trim: true,
    },
    student_batch: {
      type: String,
      required: true,
      trim: true,
    },
    start_time: {
      type: String,
      required: true,
      trim: true,
    },
    end_time: {
      type: String,
      required: true,
      trim: true,
    },
    mentor_id: {
      type: ObjectId,
      ref: "mentors",
    },
    previously_assigned_mentor: { type: Schema.Types.Mixed, default: {} },
  },
  { minimize: false, timestamps: true }
);

const Students = mongoose.model("students", studentSchema);

export { Students };
