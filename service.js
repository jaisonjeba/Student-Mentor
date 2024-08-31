import { ObjectId } from "mongodb";
import { client } from "./index.js";

export function getStudentById(id) {
  return client
    .db("b42wd2")
    .collection("student")
    .findOne({ _id: new ObjectId(id) });
}
export function getMentorById(id) {
  return client
    .db("b42wd2")
    .collection("mentor")
    .findOne({ _id: new ObjectId(id) });
}
export function changeMentor(student, updateStudentDetail) {
  return client
    .db("b42wd2")
    .collection("student")
    .updateOne({ name: student }, { $set: updateStudentDetail });
}
export function UpdateNewMentor(mentor, assignStudents) {
  return client
    .db("b42wd2")
    .collection("mentor")
    .updateOne({ name: mentor }, { $set: { students: assignStudents } });
}
export function newFunction(checkPreviousMentor, updateList) {
  return client
    .db("b42wd2")
    .collection("mentor")
    .updateOne(
      { name: checkPreviousMentor.name },
      { $set: { students: updateList } }
    );
}
export function assignMentors(student, mentor) {
  return client
    .db("b42wd2")
    .collection("student")
    .updateOne({ name: student }, { $set: { mentor: mentor } });
}
export function updateStudentList(mentor, assignStudents) {
  return client
    .db("b42wd2")
    .collection("mentor")
    .updateOne({ name: mentor }, { $set: { students: assignStudents } });
}
export function checkStudentByName(student) {
  return client.db("b42wd2").collection("student").findOne({ name: student });
}
export function checkMentorByName(mentor) {
  return client.db("b42wd2").collection("mentor").findOne({ name: mentor });
}
export function createStudents(name, email, batch, course) {
  return client.db("b42wd2").collection("student").insertOne({
    name: name,
    email: email,
    batch: batch,
    course: course,
  });
}
export function checkStudentByEmail(email) {
  return client.db("b42wd2").collection("student").findOne({ email: email });
}
export function checkMentorByEmail(email) {
  return client.db("b42wd2").collection("mentor").findOne({ email: email });
}
export function createMentors(name, email, role) {
  return client.db("b42wd2").collection("mentor").insertOne({
    name: name,
    email: email,
    role: role,
    students: [],
  });
}
