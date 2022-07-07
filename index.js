require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.port || 8080;
const userRoutes = require("./routes/users");
app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://jstreich:1234@jfscluster.ibjzj.mongodb.net/?retryWrites=true&w=majority"
);

const noteSchema = new mongoose.Schema({
  text: String,
  date: Date,
});

const Note = mongoose.model("Note", noteSchema);

//post request to the end point, then include below

app.post(`/save`, async (req, res) => {
  let savedNote = req.body;

  const newNote = new Note(savedNote);
  await newNote.save();

  // // saveNote();
  getAllNotes();
});

async function getAllNotes() {
  const notes = await Note.find();
  console.log(notes);
}

// Routes;
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to Leyenda</h1>`);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
