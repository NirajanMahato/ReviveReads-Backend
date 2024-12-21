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
const postBook = async (req, res) => {
  try {
    const { id } = req.headers;
    const { title, genre, description, price, condition } = req.body;
    // Handle multiple images
    const images = req.files.map((file) => file.originalname); // Store the original file names
    const book = new Book({
      seller: id,
      title,
      genre,
      description,
      price,
      condition,
      images: images,
    });
    const data = await book.save();
    res.status(200).json({ message: "Book posted successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  getAllBooks,
  postBook,
};
