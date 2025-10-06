require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Registration route
app.post('/api/register', async (req, res) => {
  const { name, studentId, email, password, profilePicture } = req.body;
  if (!name || !studentId || !email || !password || !profilePicture) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (!email.endsWith('@uohyd.ac.in')) {
    return res.status(400).json({ message: 'Only university email addresses are allowed.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    const user = new User({ name, studentId, email, password, profilePicture });
    await user.save();
    // Simulate login by returning user info (in real app, use JWT/session)
    res.status(201).json({ message: 'Account created successfully.', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
