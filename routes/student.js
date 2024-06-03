import express from "express";
import {
  assignMentor,
  createStudent,
  getAllStudents,
  getAllStudentsOfAMentor,
  getStudentById,
  getStudentsWithoutMentor,
  populateMentors,
  updateStudent,
} from "../Controllers/student.js";
import { updateMentor, updateMentorStudent } from "../Controllers/mentor.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const allStudents = await getAllStudents();
    if (allStudents.length <= 0) {
      return res.status(200).json({ message: "No students found" });
    }
    return res
      .status(200)
      .json({ message: "Sucessfully get all students", data: allStudents });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const student_id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(student_id))
      return res
        .status(404)
        .json({ message: `Not a valid student id :${student_id}` });
    const getSpecificStudent = await getStudentById(student_id);

    if (!getSpecificStudent) {
      return res.status(200).json({ message: "student not found" });
    }
    return res.status(200).json({ data: getSpecificStudent });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error in get student" });
  }
});
router.put("/edit/:id", async (req, res) => {
  try {
    const student_id = req.params.id;
    const payload = { ...req.body };
    if (!mongoose.Types.ObjectId.isValid(student_id))
      return res
        .status(404)
        .json({ message: `Not a valid student id :${student_id}` });
    const updateSpecificStudent = await updateStudent(student_id, payload);

    if (!updateSpecificStudent) {
      return res.status(200).json({ message: "student not found" });
    }
    return res.status(200).json({ data: updateSpecificStudent });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error in get student" });
  }
});

// 5. Write API to show all students for a particular mentor
router.get("/all/mentor/:id", async (req, res) => {
  try {
    const mentor_id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(mentor_id))
      return res
        .status(404)
        .json({ message: `Not a valid mentor id :${mentor_id}` });
    const students_of_particular_mentor = await getAllStudentsOfAMentor(
      mentor_id
    );
    if (students_of_particular_mentor.length <= 0) {
      return res.status(200).json({ message: "No students found" });
    }
    return res.status(200).json({
      message: "Sucessfully Get all students for specific mentor",
      data: students_of_particular_mentor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Write API to create Student
router.post("/create", async (req, res) => {
  try {
    let mentor_id;
    let previously_assigned_mentor = {};
    if (
      !req.body.student_name ||
      !req.body.student_email ||
      !req.body.student_course ||
      !req.body.student_batch ||
      !req.body.start_time ||
      !req.body.end_time
    ) {
      return res.status(400).json({
        error:
          "student_name, student_email, student_course, student_batch, start_time, end_time are required",
      });
    }
    if (!req.body.mentor_id) {
      mentor_id = null;
    } else {
      mentor_id = req.body.mentor_id;
    }

    const newStudent = await createStudent(
      req,
      mentor_id,
      previously_assigned_mentor
    );

    if (!newStudent) {
      return res.send(400).json({ error: "error creating new student" });
    }

    return res
      .status(201)
      .json({ message: "Sucessfully added new student", data: newStudent });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 3. Write API to Assign a student to Mentor
// A student who has a mentor should not be shown in List
router.get("/all/withoutMentor", async (req, res) => {
  try {
    const withoutMentor = await getStudentsWithoutMentor();
    if (withoutMentor.length <= 0) {
      return res.status(400).json({ message: "No results found" });
    }
    return res.status(200).json({
      message: "Sucessfully Got all students without mentor",
      data: withoutMentor,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error in without mentor" });
  }
});

// 4. Write API to Assign or Change Mentor for particular Student
// Select One Student and Assign one Mentor

router.put("/assignMentor/:id", async (req, res) => {
  try {
    const student_id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(student_id))
      return res
        .status(404)
        .json({ message: `Not a valid student id :${student_id}` });
    const mentor_id = req.body.mentor_id;
    if (!mentor_id) {
      return res.status(400).json({ error: "mentor_id is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(mentor_id))
      return res
        .status(404)
        .json({ message: `Not a valid mentor id :${mentor_id}` });
    const assignMentorData = await assignMentor(student_id, mentor_id);
    if (assignMentorData.length <= 0) {
      return res.status(400).json({ error: "Error in assigning mentor" });
    }
    const previous_mentors_id = assignMentorData[0].previous_mentors_id;

    await updateMentorStudent(previous_mentors_id, student_id);

    const updatedStudentData = await updateStudent(student_id, {
      previously_assigned_mentor:
        assignMentorData[0].previously_assigned_mentor,
      mentor_id: assignMentorData[0].mentor_id,
    });

    await updateMentor(mentor_id, student_id);
    return res.status(201).json({
      message: "Sucessfully assigned new mentor or updated the mentor",
      data: updatedStudentData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 6. Write an API to show the previously assigned mentor for a particular student.

router.get("/previousMentors/:id", async (req, res) => {
  try {
    const student_id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(student_id))
      return res
        .status(404)
        .json({ message: `Not a valid student id :${student_id}` });
    const previous_mentors = await getStudentById(student_id);
    if (!previous_mentors) {
      return res.status(400).json({ error: "Error in finding student" });
    }
    const previous_mentors_obj = previous_mentors.previously_assigned_mentor;
    let previous_mentors_values_arr = [];
    for (const key in previous_mentors_obj) {
      if (previous_mentors_obj[key] != null) {
        previous_mentors_values_arr.push(previous_mentors_obj[key]);
      }
    }
    if (previous_mentors_values_arr.length <= 0) {
      return res.status(400).json({
        error: "There is no previous mentors assigned to the student",
      });
    }
    const populate_previous_mentors = await populateMentors({
      previously_assigned_mentor: [...previous_mentors_values_arr],
    });
    return res.status(200).json({ data: populate_previous_mentors });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export const studentRouter = router;
