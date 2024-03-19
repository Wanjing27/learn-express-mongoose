const BookInstance = require('../models/bookinstance');

exports.show_all_books_status = function(res) {
  BookInstance.find({}, 'book status')
    .populate('book', 'title')
    .exec((err, bookInstances) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching book instances');
      }
      const formattedBookInstances = bookInstances.map(instance => ({
        title: instance.book.title,
        status: instance.status
      }));
      res.send(formattedBookInstances);
    });
}
