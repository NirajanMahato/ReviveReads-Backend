const Book = require("../models/Book");
const User = require("../models/User");

//Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("seller", "name email address");
    res.status(200).send(books);
  } catch (error) {
    res.status(404).json({ message: "Books not found" }, error);
  }
};

// Post a book
const postBook = async (req, res) => {
  try {
    const userId  = req.user.id;
    const { title, genre, description, price, condition, delivery } = req.body;
    // Handle multiple images
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one image is required!" });
    }
    // Handle multiple images
    const images = req.files.map((file) => file.originalname); // Store the original file names
    const book = new Book({
      seller: userId,
      title,
      genre,
      description,
      price,
      condition,
      delivery: delivery || false,
      images: images,
    });
    const data = await book.save();

    // Add the book ID to the user's book_listings array
    await User.findByIdAndUpdate(userId, {
      $push: { book_listings: data._id }, // Push the book ID into the user's book_listings array
    });
    res.status(200).json({ message: "Book posted successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get a book by id
const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get books posted by a specific user
const getBookByUser = async (req, res) => {
  try {
    const { id } = req.headers;
    const books = await Book.find({ seller: id });
    res.status(200).send(books);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a book
const deleteBookById = async (req, res) => {
  try {
    const { bookid } = req.headers;
    const userId = req.user.id;
    
    const book = await Book.findByIdAndDelete(bookid);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { book_listings: bookid }, // Remove the book ID
    });

    return res.status(200).json({ message: "Book deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//Update book
const updateBook = async (req, res) => {
  try {
    const { bookId } = req.headers;
    const { title, genre, description, price, condition, delivery } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found!" });
    }

    const updateFields = {
      title,
      genre,
      description,
      price,
      condition,
      delivery,
    };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.originalname);
      updateFields.images = [...book.images, ...newImages];
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updateFields, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Book updated successfully!", data: updatedBook });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

module.exports = {
  getAllBooks,
  postBook,
  getBookById,
  getBookByUser,
  deleteBookById,
  updateBook,
};
