const { mongoInstance } = require("./dbConnect");
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser");

const { ObjectId } = require("mongodb");

async function startServer() {
  try {
    await mongoInstance.connectDB();
  } catch (error) {
    console.log("Failed to connect to database", error);
    // process.exit(1);
  }
}

startServer();
app.use(bodyParser.json());

// MONGO DB USERS

// app.set("view engine", "pug");

// // GET ALL
// app.get("/users", async (req, res) => {
//   try {
//     const dbMongo = mongoInstance.getDB();
//     const usersCollection = dbMongo.collection("users");
//     const allUsers = await usersCollection.find().toArray();
//     const data = { users: allUsers };
//     res.render("usersList", data);
//   } catch (error) {
//     console.log("Failed to connect to database", error);
//   }
// });

// // GET ID
// app.get("/users/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const dbMongo = mongoInstance.getDB();
//     const usersCollection = dbMongo.collection("users");
//     const findUserId = await usersCollection.findOne({
//       _id: new ObjectId(id),
//     });

//     if (!findUserId) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     const { name, email, password } = findUserId;
//     const data = { title: "Користувач ID", name, email, password };
//     res.render("user", data);
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal Server Error. User ID not found",
//       error,
//     });
//   }
// });

// MONGO DB COMMENTS
app.set("view engine", "ejs");

// //GET ALL
app.get("/comments", async (req, res) => {
try {
  const dbMongo = mongoInstance.getDB();
  const commentsCollection = dbMongo.collection("comments");
  const allComments = await commentsCollection.find().toArray();
  const partComments = allComments.slice(0, 20);
  const data = { comments: partComments };
  res.render("commentsList", data);
} catch (error) {
  console.log("Failed to connect to database", error);
}
});

// //GET ID
app.get("/comments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dbMongo = mongoInstance.getDB();
    const commentsCollection = dbMongo.collection("comments");
    const findCommentId = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!findCommentId) {
      return res.status(404).json({ message: "Comments not found." });
    }

    const { name, text, date } = findCommentId;
    const data = { name, text, date };
    res.render("comment", data);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error. Comment ID not found",
      error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
