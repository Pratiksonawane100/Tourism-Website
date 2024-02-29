const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb'); // Add this line
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();


// Connect to MongoDB
mongoose.connect('mongodb+srv://pratik100sonawane:mongo2023@cluster3.wzykeeb.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Create a user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your_secret_key',
    resave: true,
    saveUninitialized: false,
  })
);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the registration and login system.');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});
app.get('/book2', (req, res) => {
  res.sendFile(__dirname + '/book2.html');
});
app.get('/place', (req, res) => {
  res.sendFile(__dirname + '/place.html');
});
app.get('/booking2', (req, res) => {
  res.sendFile(__dirname + '/booking2.html');
});
app.get('/booking1', (req, res) => {
  res.sendFile(__dirname + '/booking1.html');
});
app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/booking-history', (req, res) => {
  res.sendFile(__dirname + '/booking-history.html');
});
app.get('/india', (req, res) => {
  res.sendFile(__dirname + '/india.html');
});
app.get('/member', (req, res) => {
  res.sendFile(__dirname + '/member.html');
});
app.get('/about1', (req, res) => {
  res.sendFile(__dirname + '/about1.html');
});
app.get('/service1', (req, res) => {
  res.sendFile(__dirname + '/service1.html');
});
app.get('/weather', (req, res) => {
  res.sendFile(__dirname + '/weather.html');
});
app.get('/submit-booking', (req, res) => {
  res.sendFile(__dirname + '/submit-booking.html');
});
app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/contact.html');
});


app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.redirect('/register');
  }
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });

//   if (user) {
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (validPassword) {
//       req.session.userId = user._id;
//       res.redirect('/dashboard');
//     } else {
//       res.send('Invalid password');
//     }
//   } else {
//     res.send('User not found');
//   }
// });

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      req.session.userId = user._id;
      // Redirect to the dashboard.html file
      res.sendFile(__dirname + '/index.html');
    } else {
      res.send('Invalid password');
    }
  } else {
    res.send('User not found');
  }
});




app.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    res.send(`Welcome to your dashboard, user ID: ${req.session.userId}`);
  } else {
    res.send('Unauthorized. Please login first.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  contact: Number,
});

const Booking = mongoose.model('Booking', bookingSchema);

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/booking2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'booking2.html'));
});

app.post('/submit-booking', (req, res) => {
  const { name, email, checkIn, checkOut, guests, contact } = req.body;

  const booking = new Booking({
      name,
      email,
      checkIn,
      checkOut,
      guests,
      contact,      
  });

  booking.save()
      .then(() => {
          res.status(200).json({ message: 'Booking successful. Thank you!' });
      })
      .catch((err) => {
          res.status(500).json({ message: 'Booking failed. Please try again later.' });
      });
});

const Contact = mongoose.model('Contact', {
  name: String,
  email: String,
  message: String
});

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

app.post('/submit-contact', async (req, res) => {
  try {
      const { name, email, message } = req.body;

      const contact = new Contact({ name, email, message });
      await contact.save();

      res.json({ message: 'Your message has been received. We will contact you soon.' });
  } catch (error) {
      res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// app.post('/submit-contact', async (req, res) => {
//   try {
//       const { name, email, datetime, message } = req.body;

//       const contact = new Contact({ name, email, datetime, message });
//       await contact.save();

//       res.json({ message: 'Your message has been received. We will contact you soon.' });
//   } catch (error) {
//       res.status(500).json({ message: 'An error occurred. Please try again later.' });
//   }

// app.post('/submit-booking', (req, res) => {
//   const { name, email, datetime, destination, specialRequest } = req.body;

//   const newBooking = new Booking({
//     name,
//     email,
//     datetime,
//     destination,
//     specialRequest,
//   });

//   newBooking.save((err) => {
//     if (err) {
//       res.status(500).send('Error saving data to the database');
//     } else {
//       res.status(200).send('Data saved successfully');
//     }
//   });
// });

