const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Increase header size limit to 32KB to prevent 431 errors
server.maxHeadersSize = 32 * 1024;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// MongoDB Connection with timeout
mongoose.connect('mongodb://localhost:27017/laptopRegistration', {
  serverSelectionTimeoutMS: 5000 // 5-second timeout
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit if MongoDB fails to connect
  });

// User Schema
const userSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  serialNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  batch: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }
});

const User = mongoose.model('User', userSchema);

// API Endpoints
app.get('/api', (req, res) => res.json({ message: 'Welcome to the Laptop Registration API' }));

app.post('/register', async (req, res) => {
  try {
    const { studentId, serialNumber, name, batch, username, password } = req.body;
    if (!studentId || !serialNumber || !name || !batch || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      studentId,
      serialNumber,
      name,
      batch,
      username,
      password: hashedPassword
    });
    await user.save();
    console.log(`User registered: ${username}`);
    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error.message, error.stack);
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Duplicate studentId, serialNumber, or username' });
    } else {
      res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
    }
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log(`User logged in: ${username}`);
      res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        username: user.username
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
});

app.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.status(200).json({
        studentId: user.studentId,
        serialNumber: user.serialNumber,
        name: user.name,
        batch: user.batch,
        username: user.username
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile fetch error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Users fetch error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log(`User deleted: ${user.username}`);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { studentId, serialNumber, name, batch, username, password } = req.body;
    if (!studentId || !serialNumber || !name || !batch || !username) {
      return res.status(400).json({ success: false, message: 'All fields except password are required' });
    }
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updateData = { studentId, serialNumber, name, batch, username };
    if (hashedPassword) updateData.password = hashedPassword;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log(`User updated: ${username}`);
    res.status(200).json({ success: true, message: 'User updated successfully', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    console.error('Update user error:', error.message, error.stack);
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Duplicate studentId, serialNumber, or username' });
    } else {
      res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
    }
  }
});

app.post('/admin/add', async (req, res) => {
  try {
    const { studentId, serialNumber, name, batch, username, password, role } = req.body;
    if (!studentId || !serialNumber || !name || !batch || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      studentId,
      serialNumber,
      name,
      batch,
      username,
      password: hashedPassword,
      role: role || 'user'
    });
    await user.save();
    console.log(`Admin added user: ${username}`);
    res.status(201).json({ success: true, message: 'User added successfully' });
  } catch (error) {
    console.error('Add user error:', error.message, error.stack);
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Duplicate studentId, serialNumber, or username' });
    } else {
      res.status(500).json({ success: false, message: 'Error adding user', error: error.message });
    }
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Start the server on all interfaces
server.listen(3001, '0.0.0.0', () => console.log('Server running on port 3001'));


//cd /home/bnaz/Documents/laptop-registration
// To run the server, use the command: node server.js
//cd /home/bnaz/Documents/laptop-registration
// To run the client, use the command: npm start
// Note: Ensure MongoDB is running before starting the server
//cd /home/bnaz/Documents/laptop-registration/client
// To build the client, use the command: npm run build


