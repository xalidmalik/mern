const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    refs: "users"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        refs: "users"
      }
    }
  ],
  comment: [
    {
      user: {
        type: Schema.Types.ObjectId,
        refs: "users"
      },
      name: {
        type: String,
        required: true
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = Post = mongoose.model("post", PostSchema);
