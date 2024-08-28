const express = require("express");

const {
  getAllUsers,
  addUser,
  deleteUser,
  updateUser,
  searchUsers,
  getAllUsersWithoutPagnation,
  insertSheet,
} = require("../controllers/userControler");
const { auth } = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "upload/" });

router.post("/uploadFile", upload.single("file"), insertSheet);
router.get("/", auth, getAllUsers);
router.get("/getAll", getAllUsersWithoutPagnation);
router.post("/add", auth, addUser);
router.delete("/delete/:id", auth, deleteUser);
router.put("/update/:id", auth, updateUser);
router.get("/search", searchUsers);
module.exports = router;
