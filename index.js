const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { mongoInstance } = require("./dbConnect");
const { ObjectId } = require("mongodb");

require("dotenv").config();

const PORT = process.env.PORT || 8000;
const JWT = process.env.JWT_SECRET_KEY;

async function startServer() {
  try {
    await mongoInstance.connectDB();
  } catch (error) {
    console.log("Failed to connect to database", error);
    process.exit(1);
  }
}

startServer();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// middleware for static files
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

// middleware checks authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
   return res.status(403).json({message: "Access denied"})
  }

  jwt.verify(token, JWT, (error, user) => {
    if(error) {
      return res.status(403).json({message: "Access denied"})
    }

    req.user = user;
    next();
  })
}

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

// GET ID
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

// REGISTERING USER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const dbMongo = mongoInstance.getDB();
    const usersCollection = dbMongo.collection("users");
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User exists." });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    //create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
    };
    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.log("Error user registering ", error);
    res.status(500).json("Error user registering ");
  }
});

//USER LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const dbMongo = mongoInstance.getDB();
    const usersCollection = dbMongo.collection("users");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    //JWT
    const token = jwt.sign({ userId: user._id, name: user.name }, JWT, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Login successfull" });
  } catch (error) {
    console.log("Authentication failed", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

//security jwt

app.get("/protected", authenticateJWT, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed', user: req.user});
})

// MONGO DB COMMENTS
app.set("view engine", "ejs");

//  // GET ALL
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

// GET ID
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

// GET THEME
// app.get("/theme", (req, res) => {
//   const chooseTheme = req.cookies.theme || "light";
//   res.render("theme", { chooseTheme });
// });

//POST THEME
// app.post("/set-theme", (req, res) => {
//   const { theme } = req.body;

//   console.log("Theme: ", theme);

//   if (theme === "light" || theme === "dark") {
//     res.cookie("theme", theme, { maxAge: 900000, httpOnly: true });
//     console.log("Theme saved in cookie:",  theme);
//     res.redirect("/theme");
//   } else {
//     console.log("Theme not found", theme);
//     res.status(400).send("Not found theme");
//   }
// });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
