import { Mentors } from "../models/mentor.js";

export function updateMentor(mentor_id, student_id) {
  return Mentors.findByIdAndUpdate(mentor_id, {
    $addToSet: { students: student_id },
  });
}
export function updateMentorByPayload(mentor_id, payload) {
  return Mentors.findByIdAndUpdate(mentor_id, {
    $set: payload,
  });
}

export function updateMentorStudent(mentor_id, student_id) {
  return Mentors.findByIdAndUpdate(mentor_id, {
    $pull: { students: student_id },
  });
}
export function getAllMentors() {
  return Mentors.find()
    .populate({
      path: "students",
      select: "student_name",
      strictPopulate: false,
    })
    .sort({ mentor_name: 1 });
}

export function getMentorById(mentorId) {
  return Mentors.findById(mentorId.trim());
}

export function addStudents(req, mentor_id) {
  return Mentors.findByIdAndUpdate(mentor_id, {
    $push: {
      students: {
        $each: [...req.body.students],
        $position: 0,
      },
    },
  });
}
export function createMentor(req, students_arr) {
  return new Mentors({ ...req.body, students: [...students_arr] }).save();
}
