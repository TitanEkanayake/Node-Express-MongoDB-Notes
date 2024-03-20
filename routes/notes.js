const express = require("express");
const router = express.Router();
const Note = require("../models/notes");

// getting all
router.get("/", async (req, res) => {
  //   res.send("Hello, world!");
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// getting one
router.get("/:id", getnote, (req, res) => {
  res.json(res.note);
});
//creating one
router.post("/", async (req, res) => {
  const note = new Note({
    name: req.body.name,
    description: req.body.description,
    userId: req.body.userId,
  });
  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// updating one
router.patch("/:id", getnote, async (req, res) => {
  if (req.body.name != null) {
    res.note.name = req.body.name;
  }
  if (req.body.description != null) {
    res.note.description = req.body.description;
  }
  try {
    const updatednote = await res.note.save();
    res.json(updatednote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// deleting one
router.delete("/:id", getnote, async (req, res) => {
  try {
    await res.note.deleteOne();
    res.json({ message: "Note Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Middleware
async function getnote(req, res, next) {
  let note;
  try {
    note = await Note.findById(req.params.id);
    if (note == null) {
      return res.status(404).json({ message: "cannot find the note" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.note = note;
  next();
}
module.exports = router;
