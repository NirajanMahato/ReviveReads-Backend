const Book = require("../models/Book");

//Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (error) {
    res.status(404).json({ message: "Books not found" }, error);
  }
};

// Post a book
const saveBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(200).json({ message: "Book added successfully", book})
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
