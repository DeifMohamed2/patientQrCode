const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const patientRoutes = require('./routes/patientRoutes');
const path = require('path');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// Routes
app.use('/', patientRoutes);



// Error Handling
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found!' });
});

const PORT = process.env.PORT || 3906;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
