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


router.get("/", auth, getAllUsers);
router.get("/getAll", getAllUsersWithoutPagnation);
router.post("/add", auth, addUser);
router.delete("/delete/:id", auth, deleteUser);
router.put("/update/:id", auth, updateUser);
router.get("/search", searchUsers);
module.exports = router;
