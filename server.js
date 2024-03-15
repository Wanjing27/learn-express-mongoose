const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const mongoose = require('mongoose');
const mongoDB = "mongodb://127.0.0.1:27017/my_library_db";
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function() {
  console.log('Connected to database');
});

// Import your models here
const Book = require('./models/book');
const Author = require('./models/author');

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());

// GET /available - returns list of objects {title, status} where the status is “available”
app.get('/available', async (_, res) => {
  try {
    const availableBooks = await Book.find({ status: 'Available' }).select('title status');
    res.json(availableBooks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// GET /authors - returns a list of author objects {name, lifespan}
app.get('/authors', async (_, res) => {
  try {
    const authors = await Author.find().select('name lifespan');
    res.json(authors);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
