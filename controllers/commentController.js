const { mongoInstance } = require("../dbConnect");
const { ObjectId } = require("mongodb");

const commentController = {
  // GET ALL
  async getComments(req, res) {
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
  },

  // GET ID

  async getCommentById(req, res) {
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
  },
};

module.exports = { commentController };