import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation,
      } = req.body;
      
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(404).json({
          msg: "Already such an account with this email. Try a new one!",
        });
      }
  
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000)
      });
      const savedUser = await user.save();
      if (!savedUser) {
        throw new Error("Cannot create a User");
      } else {
        return res.status(201).json(savedUser);
      }
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };

// /* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist. " });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ msg: "Invalid credentials. " });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '24h'});
    delete user.password;
    return res.status(200).json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


