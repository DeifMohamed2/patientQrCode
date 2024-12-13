require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const Patient = require('../models/patient');

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect('/login');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.redirect('/login');
  }
};

router.get('/', async (req, res) => {
  const userCount = await Patient.countDocuments(); // Count users in the database
  res.render('index', { userCount });
});

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newPatient = new Patient({ name, email, password: hashedPassword });
  await newPatient.save();
  res.redirect('/');
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const patient = await Patient.findOne({ email });
  if (patient && (await bcrypt.compare(password, patient.password))) {
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('jwt', token, { httpOnly: true });
    res.redirect(`/profile/${patient._id}`);
  } else {
    res.status(400).render('error', { message: 'Invalid credentials' });
  }
});

// Profile
router.get('/profile/:id', async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  const qrCode = await QRCode.toDataURL(
    `${req.protocol}://r9f75hc3-3000.euw.devtunnels.ms/profile/${patient._id}`
  );
  console.log(
    `${req.protocol}://r9f75hc3-3000.euw.devtunnels.ms/profile/${patient._id}`
  );
  const isEditable = !!req.cookies.jwt; // Editable if logged in

  res.render('profile', { patient, qrCode, isEditable , files: patient.files});
});

// Upload Files
router.post('/upload', verifyToken, async (req, res) => {
  const { url, title, description, fileType } = req.body;
  const patient = await Patient.findById(req.user.id);
  patient.files.push({
    url,
    title,
    description,
    type: fileType,
  });
  await patient.save();
  res.redirect(`/profile/${patient._id}`);
});

module.exports = router;
