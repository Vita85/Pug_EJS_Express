const { mongoInstance } = require("../dbConnect");

const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SECRET_KEY;

const userController = {
  // GET ALL
  async getUsers(req, res) {
    try {
      const dbMongo = mongoInstance.getDB();
      const usersCollection = dbMongo.collection("users");
      const allUsers = await usersCollection.find().toArray();
      const data = { users: allUsers };
      res.render("usersList", data);
    } catch (error) {
      console.log("Failed to connect to database", error);
    }
  },

  // GET ID
  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const dbMongo = mongoInstance.getDB();
      const usersCollection = dbMongo.collection("users");
      const findUserId = await usersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!findUserId) {
        return res.status(404).json({ message: "User not found." });
      }

      const { name, email, password } = findUserId;
      const data = { title: "Користувач ID", name, email, password };
      res.render("user", data);
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error. User ID not found",
        error,
      });
    }
  },

  // REGISTERING USER
  async registerUser(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Required fields." });
      }

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
  },

  //USER LOGIN
  async userLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Required fields." });
      }

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
  },
};

module.exports = { userController };