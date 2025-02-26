const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const BASE_URL = "http://localhost:5000"; // API Base URL
let token;
let bookId;

describe("Book API Routes", () => {
  //   Step 1: Log in before running tests to get a fresh token
  before((done) => {
    chai
      .request(BASE_URL)
      .post("/api/user/sign-in")
      .send({
        email: "nirajanmahato@gmail.com", // Use a valid user email
        password: "password123", // Ensure this matches your database credentials
      })
      .end((err, res) => {
        console.log("Login Response:", res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("user");
        token = res.body.user.token;
        done();
      });
  });

  //   Test: Add a new book
  it("should add a new book", (done) => {
    chai
      .request(BASE_URL)
      .post("/api/book/post-book")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Advanced Node.js",
        author: "John Backend",
        genre: "Programming",
        price: 1000,
        condition: "New",
      })
      .end((err, res) => {
        console.log("Add Book Response:", res.body); // Debug the response
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("success", true);
        bookId = res.body.book?._id; // Ensure book ID is correctly retrieved
        console.log("Book ID:", bookId);
        done();
      });
  });

  //   Test: Fetch book details
  it("should fetch book details", (done) => {
    if (!bookId) return done(new Error("No valid bookId found!")); // Check if book ID exists
    chai
      .request(BASE_URL)
      .get(`/api/book/get-book-by-id/${bookId}`)
      .end((err, res) => {
        console.log("Fetch Book Response:", res.body); // Debug the response
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("title", "Advanced Node.js");
        done();
      });
  });

  //   Test: Mark book as sold
  it("should mark the book as sold", (done) => {
    if (!bookId) return done(new Error("No valid bookId found!")); // Check if book ID exists
    chai
      .request(BASE_URL)
      .patch(`/api/book/mark-as-sold/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        console.log("Mark as Sold Response:", res.body); // Debug the response
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        done();
      });
  });

  //   Test: Delete the book
  it("should delete a book", (done) => {
    if (!bookId) return done(new Error("No valid bookId found!")); // Check if book ID exists
    chai
      .request(BASE_URL)
      .delete("/api/book/delete-book")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId })
      .end((err, res) => {
        console.log("Delete Book Response:", res.body); // Debug the response
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success", true);
        done();
      });
  });
});
