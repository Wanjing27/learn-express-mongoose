const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let Home = require('./pages/home');
let Books = require('./pages/books');
let Authors = require('./pages/authors');
let BookDetails = require('./pages/book_details');
let CreateBook = require('./pages/create_book');

const mongoose = require('mongoose');
const mongoDB = "mongodb://127.0.0.1:27017/my_library_db";
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function() {
  console.log('Connected to database');
});

// Define Mongoose schema for Book and Author
const bookSchema = new mongoose.Schema({
  title: String,
  status: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
});

const authorSchema = new mongoose.Schema({
  name: String,
  lifespan: String
});

const Book = mongoose.model('Book', bookSchema);
const Author = mongoose.model('Author', authorSchema);

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());

// GET /home route
app.get('/home', (_, res) => {
  Home.show_home(res);
})

// GET /available route - Returns list of available books
app.get('/available', (_, res) => {
  Book.find({ status: "available" }, 'title status')
    .then(books => res.send(books))
    .catch(err => res.status(500).send(err));
})

// GET /books route
app.get('/books', (_, res) => {
  Books.show_books()
    .then((data) => res.send(data))
    .catch((_) => res.send('No books found'));
})

// GET /authors route - Returns list of authors
app.get('/authors', (_, res) => {
  Author.find({}, 'name lifespan')
    .then(authors => res.send(authors))
    .catch(err => res.status(500).send(err));
})

// GET /book_dtls route
app.get('/book_dtls', (req, res) => {
  BookDetails.show_book_dtls(res, req.query.id);
})

// POST /newbook route
app.post('/newbook', (req, res) => {
  const familyName = req.body.familyName;
  const firstName = req.body.firstName;
  const genreName = req.body.genreName;
  const bookTitle = req.body.bookTitle;
  if (familyName && firstName && genreName && bookTitle) {
    CreateBook.new_book(res, familyName, firstName, genreName, bookTitle).catch(err => {
      res.send('Failed to create new book ' + err);
    });
  } else {
    res.send('Invalid Inputs');
  }
})
