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
  // excerpt: String,
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

// find one, delete, look through other methods

// async function main() {
//   const uri =
//     "mongodb+srv://<jstreich>:<1234>@<your-cluster-url>/sample_airbnb?retryWrites=true&w=majority";

//   const client = new MongoClient(uri);

//   try {
//     // Connect to the MongoDB cluster
//     await client.connect();

//     // Make the appropriate DB calls
//     await listDatabases(client);
//   } catch (e) {
//     console.error(e);
//   } finally {
//     // Close the connection to the MongoDB cluster
//     await client.close();
//   }
// }

// main().catch(console.error);

// /**
//  * Print the names of all available databases
//  * @param {MongoClient} client A MongoClient that is connected to a cluster
//  */
// async function listDatabases(client) {
//   databasesList = await client.db().admin().listDatabases();

//   console.log("Databases:");
//   databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
// }

// Routes;
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to Leyenda</h1>`);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
