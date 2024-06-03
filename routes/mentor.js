import express from "express";
import {
  addStudents,
  createMentor,
  getAllMentors,
  getMentorById,
  updateMentorByPayload,
} from "../Controllers/mentor.js";
import { updateStudent } from "../Controllers/student.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const getAllMentor = await getAllMentors();

    if (getAllMentor.length <= 0) {
      return res.status(200).json({ message: "No mentors found" });
    }

    return res
      .status(200)
      .json({ message: "Get all mentors Sucessfully", data: getAllMentor });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const mentorId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(mentorId))
      return res
        .status(404)
        .json({ message: `Not a valid mentor id :${mentorId}` });

    const findMentor = await getMentorById(mentorId);
    if (!findMentor) {
      return res.status(200).json({ message: "No mentor found" });
    }
    return res.status(200).json({
      message: "Get mentor Sucessfully",
      data: findMentor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.put("/edit/:id", async (req, res) => {
  try {
    const mentorId = req.params.id;
    const payload = { ...req.body };
    if (!mongoose.Types.ObjectId.isValid(mentorId))
      return res
        .status(404)
        .json({ message: `Not a valid mentor id :${mentorId}` });

    const updateMentor = await updateMentorByPayload(mentorId, payload);
    if (!updateMentor) {
      return res.status(200).json({ message: "No mentor found" });
    }
    return res.status(200).json({
      message: "Get mentor Sucessfully",
      data: updateMentor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 3. Write API to Assign a student to Mentor
// Select one mentor and Add multiple Student

router.put("/add/students/:id", async (req, res) => {
  try {
    const mentor_id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(mentor_id))
      return res
        .status(404)
        .json({ message: `Not a valid mentor id :${mentor_id}` });
    if (req.body.students.length <= 0) {
      return res
        .status(200)
        .json({ message: "Atleast one student is required!" });
    }
    const findMentor = await getMentorById(mentor_id);

    if (!findMentor) {
      return res.status(200).json({ message: "No mentor found" });
    }
    const addMultipleStudents = await addStudents(req, mentor_id);
    let promiseArray = [];
    [...req.body.students].forEach((element) => {
      promiseArray.push(updateStudent(element, { mentor_id }));
    });
    Promise.all(promiseArray).then((values) => {
      console.log(values);
    });

    if (addMultipleStudents.length <= 0) {
      return res.status(200).json({ error: "Error in adding students" });
    }
    return res.status(200).json({
      message: "Get all mentors Sucessfully",
      data: addMultipleStudents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 1. Write API to create Mentor
router.post("/create", async (req, res) => {
  try {
    let students_arr;
    if (!req.body.mentor_name || !req.body.mentor_email) {
      return res
        .status(400)
        .json({ error: "mentor_name and mentor_email is required" });
    }

    if (!req.body.students) {
      students_arr = [];
    } else {
      students_arr = [...req.body.students];
    }

    const newMentor = await createMentor(req, students_arr);

    if (!newMentor) {
      return res
        .status(400)
        .json({ error: "Can't create new mentor, try again" });
    }

    return res
      .status(200)
      .json({ message: "Sucessfully created new mentor", data: newMentor });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export const mentorRouter = router;
