import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import {
  assignMentors,
  checkMentorByEmail,
  createMentors,
  checkStudentByEmail,
  createStudents,
  checkMentorByName,
  checkStudentByName,
  updateStudentList,
  newFunction,
  UpdateNewMentor,
  changeMentor,
  getMentorById,
  getStudentById,
} from "./service.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
export const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hi welcome to student mentor Task");
});

// API endpoint to create mentor

app.post("/create/mentor", async (req, res) => {
  const { name, email, role } = req.body;
  const checkFromDb = await checkMentorByEmail(email);
  if (!checkFromDb) {
    const createMentor = await createMentors(name, email, role);
    res.status(200).send("Mentor create successfully");
  } else {
    res.send("Mentor details are already exists");
  }
});

// API endpoint to create student

app.post("/create/student", async (req, res) => {
  const { name, email, batch, course } = req.body;

  const checkFromDb = await checkStudentByEmail(email);
  if (!checkFromDb) {
    const createStudent = await createStudents(name, email, batch, course);
    res.status(200).send("student create successfully");
  } else {
    res.send("student details are already exists");
  }
});

// API to Assign a student to Mentor
app.post("/assign/mentor", async (req, res) => {
  const { mentor, student } = req.body;
  try {
    const checkMentor = await checkMentorByName(mentor);
    const checkStudent = await checkStudentByName(student);
    if (checkMentor && checkStudent) {
      const existStudents = checkMentor.students;
      const assignStudents = [...existStudents, student];
      const assignStudent = await updateStudentList(mentor, assignStudents);
      const assignMentor = await assignMentors(student, mentor);
      res.status(200).send("mentor assigned successfully");
    } else {
      res.send({ message: "students or mentor already assigned" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "internal server error" });
  }
});

// API to Assign or Change Mentor for particular Student

app.put("/change/mentor", async (req, res) => {
  const { mentor, student } = req.body;

  try {
    const checkMentor = await checkMentorByName(mentor);
    const checkStudent = await checkStudentByName(student);
    const checkPreviousMentor = await checkMentorByName(checkStudent.mentor);
    //remove student name in previous mentor list
    const removeStudent = checkPreviousMentor.students.filter(
      (stud) => stud !== student
    );
    const updateList = [...removeStudent];
    const updatePreviousmentorStudents = await newFunction(
      checkPreviousMentor,
      updateList
    );

    // update student name in new mentor list
    const existStudents = checkMentor.students;
    const assignStudents = [...existStudents, student];
    const assignStudent = await UpdateNewMentor(mentor, assignStudents);
    // change mentor to the student
    const updateStudentDetail = {
      mentor: mentor,
      previousMentor: checkPreviousMentor.name,
    };
    const assignMentor = await changeMentor(student, updateStudentDetail);

    res.status(200).send({ message: "mentor changed succesfully" });
  } catch (err) {
    console.log(err);
    res.send("internal server error");
  }
});

//  API to show all students for a particular mentor

app.get("/mentor/studentlist/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const get_mentor = await getMentorById(id);
    const get_students = get_mentor.students;
    res.status(200).send(get_students);
  } catch (err) {
    res.send({ message: "internal server error" });
  }
});

// API to show the previously assigned mentor for a particular student.

app.get("/student/previousmentor/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const get_student = await getStudentById(id);
    const get_previovsMentor = { previousMentor: get_student.previousMentor };
    res.status(200).send(get_previovsMentor);
  } catch (err) {
    res.send({ message: "internal server error" });
  }
});

app.listen(PORT, () => console.log(`${PORT} is running 💖`));
