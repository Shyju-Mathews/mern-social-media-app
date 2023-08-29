import User from "../models/User.js";
import Post from "../models/Post.js";

/* CREATE */
// export const createPost = async (req, res) => {
//   try {
//     const { userId, description, picturePath } = req.body;
//     const user = await User.findById(userId);
//     const newPost = new Post({
//       userId,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       location: user.location,
//       description,
//       userPicturePath: user.picturePath,
//       picturePath,
//       likes: {},
//       comments: [],
//     });
//     await newPost.save();

//     const post = await Post.find();
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(409).json({ message: err.message });
//   }
// };

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = await Post.create({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    const savedPost = await newPost.save();
    if (!savedPost) {
      return res.status(404).json({ msg: "Post created Failed" });
    } else {
      const post = await Post.find();
      return res.status(200).json(post);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    if (post) {
      return res.status(200).json(post);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    if (!post) {
      return res.status(404).json({ msg: "invalid post" });
    } else {
      return res.status(200).json(post);
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

// export const getUserPost = async (req, res) => {
//   try {
//     const id  = req.params.id;
//     const post = await Post.findById(id);
//     if (!post) {
//       res.status(404).json({ msg: "invalid post"});
//     } else {
//     res.status(200).json(post);
//     }
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({msg: "Invalid post"})
    }
    
    const deletePost = await Post.findByIdAndDelete(id);
    if (deletePost) {
      return res.status(200).json({ msg: "post deleted successfully" });
    }
    
  } catch (error) {
    console.error(error.message);
  }
};

export const getPost = async (req, res) => {
  try {
    const  id  = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({msg: "inavlid post"});
    } else {
      return res.status(200).json(post);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// export const addComment = async (req, res) => {
//   try {
//     const id = req.params.id;
//     // const { id, comments } = req.body;
//     const post = await Post.findById(id);
//     if (!post) {
//       return res.status(400).json({ msg: "Post does'nt exists" });
//     }
//     const addComment = await post.create({ ...req.body });
//     if (addComment) {
//       return res.status(200).json(addComment);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

export const addComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, comments } = req.body;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({ msg: "invalid post" });
    }

    const updatedPost = await Post.findByIdAndUpdate({
      // { comments: post.comments },
      // { new: true }
      ...req.body}
    );

    return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

// UserController.delete("/:id", async (req, res) => {
//   try {
//     const deleteduser = await User.deleteOne({ _id: req.params.id });
//     if (deleteduser) {
//         return res.status(200).json(deleteduser);
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
