import mongoose from "mongoose";
import { Mentors } from "../models/mentor.js";
import { Students } from "../models/student.js";

export function getAllStudents() {
  return Students.find()
    .populate({
      path: "mentor_id",
      strictPopulate: false,
    })
    .sort({ student_name: 1 });
}

export function populateMentors(payload) {
  return Mentors.populate(payload, {
    path: "previously_assigned_mentor",
    strictPopulate: false,
  });
}

export function getStudentById(student_id) {
  return Students.findById(student_id).populate({
    path: "mentor_id",
    strictPopulate: false,
  });
}

export function updateStudent(student_id, payload) {
  return Students.findByIdAndUpdate(student_id, payload, {
    new: true,
  }).populate({
    path: "mentor_id",
    strictPopulate: false,
  });
}
export function assignMentor(student_id, mentor_id) {
  return Students.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId.createFromHexString(student_id),
      },
    },
    {
      $group: {
        _id: "$_id",
        student_name: {
          $first: "$student_name",
        },
        previous_mentors: {
          $first: "$previously_assigned_mentor",
        },
        previous_mentors_id: {
          $first: "$mentor_id",
        },
        current_mentor_id: {
          $addToSet: {
            $cond: {
              if: {
                $toBool: {
                  $ifNull: ["$mentor_id", 0],
                },
              },
              then: {
                k: {
                  $toString: "$mentor_id",
                },
                v: "$mentor_id",
              },
              else: {
                k: {
                  $toString: "$_id",
                },
                v: null,
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        student_name: 1,
        previous_mentors: 1,
        previous_mentors_id: 1,
        current_mentor_id_obj: {
          $arrayToObject: "$current_mentor_id",
        },
      },
    },
    {
      $project: {
        _id: 1,
        student_name: 1,
        previous_mentors_id: 1,
        previously_assigned_mentor: {
          $mergeObjects: ["$previous_mentors", "$current_mentor_id_obj"],
        },
      },
    },
    {
      $set: {
        mentor_id: mongoose.Types.ObjectId.createFromHexString(mentor_id),
      },
    },
  ]);
}

export function getStudentsWithoutMentor() {
  return Students.aggregate([
    {
      $set: {
        studentWithMentor: {
          $toBool: {
            $ifNull: ["$mentor_id", 0],
          },
        },
      },
    },
    {
      $match: {
        studentWithMentor: false,
      },
    },
  ]);
}

export function getAllStudentsOfAMentor(mentor_id) {
  return Mentors.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(mentor_id),
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "students",
        foreignField: "_id",
        as: "student_list",
      },
    },
    {
      $project: {
        students: 0,
      },
    },
  ]);
}

export function createStudent(req, mentor_id, previously_assigned_mentor) {
  const studentData = new Students({
    ...req.body,
    mentor_id,
    previously_assigned_mentor,
  }).save();
  return studentData;
}
