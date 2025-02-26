const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const BASE_URL = "http://localhost:5000"; // Update based on your server setup

describe("Message API Routes", () => {
  let token;
  let receiverId = "67beb758136c3c3514afae8a"; // Replace with a real user ID

  //   Step 1: Log in to get a fresh token before running tests
  before((done) => {
    chai
      .request(BASE_URL)
      .post("/api/user/sign-in")
      .send({
        email: "nirajanmahato@gmail.com",
        password: "password123",
      })
      .end((err, res) => {
        console.log("Login Response:", res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("user");
        token = res.body.user.token; // Get new valid token
        done();
      });
  });

  //   Test: Send a message
  it("should send a message", (done) => {
    chai
      .request(BASE_URL)
      .post(`/api/messages/send/${receiverId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Hello, how are you?",
      })
      .end((err, res) => {
        console.log("Send Message Response:", res.body); // Debugging output
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("success", true);
        done();
      });
  });

  //   Test: Fetch messages between users
  it("should fetch messages between users", (done) => {
    chai
      .request(BASE_URL)
      .get(`/api/messages/${receiverId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        console.log("Fetch Messages Response:", res.body); // Debugging output
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  //   Test: Get unread message count
  it("should fetch unread message count", (done) => {
    chai
      .request(BASE_URL)
      .get("/api/messages/unread")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        console.log("Unread Messages Response:", res.body); // Debugging output
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("unreadCount").that.is.a("number");
        done();
      });
  });
});
