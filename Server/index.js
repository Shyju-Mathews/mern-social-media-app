import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// app.use(cors(
//   {
//   origin: "https://mern-social-media-app-frontend-theta.vercel.app",
//   method: ["GET,POST,PUT,DELETE, PATCH"],
//   credentials: true,
//   maxAge: 3600
//   }
//   ));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


/* FILE STORAGE */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/assets");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

let gfs;
const storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  file: (req, file) => {
    const filename = `${Date.now()}-${file.originalname}`;
    return {
      filename,
      bucketName: "uploads",
      metadata: { originalname: file.originalname },
    };
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.get("/assets/:filename", async (req, res) => {
  try {
    if (!gfs) {
      return res.status(503).json({ msg: "File storage not initialized" });
    }

    const filesCollection = mongoose.connection.db.collection("uploads.files");
    const file = await filesCollection.findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    const readStream = gfs.openDownloadStreamByName(req.params.filename);
    res.set("Content-Type", file.contentType || "application/octet-stream");
    readStream.on("error", (error) => {
      res.status(500).json({ error: error.message });
    });
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected successfully");
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));

app.listen(PORT, () => console.log(`Server Running at Port: ${PORT}`));
