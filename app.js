const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/student');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/crud_app')
  .then(() => console.log('MongoDB connected with Mongoose'))
  .catch(err => console.log('MongoDB connection error:', err));

// Create student with email & phone
app.post('/students', async (req, res) => {
  const { name, age, year, gender, email, phone } = req.body;

  if (!name || !age || !year || !gender || !email || !phone) {
    return res.status(400).json({ error: 'All fields including email and phone are required.' });
  }

  try {
    const student = new Student({ name, age, year, gender, email, phone });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student with email & phone
app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete student
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

