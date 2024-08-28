const userModel = require("../models/userModel");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs-extra");
const path = require("path");



const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const users = await userModel.find().skip(skip).limit(limit);
    const totalUsers = await userModel.countDocuments();
    res.status(200).json({
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllUsersWithoutPagnation = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addUser = async (req, res) => {
  try {
    console.log(req.body);
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({ message: "User added successfully", newUser });
  } catch (err) {
    console.error("Error adding user:", err);
    res.json({
      status: "error",
      message: err.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const deletedUser = await userModel.findByIdAndDelete(id);
    console.log(deletedUser);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", deleted: deletedUser });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "User not found" });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, churchName, code, birthDate } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name, churchName, code, birthDate },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(updatedUser);

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(409).json({
        message: "Duplicate key error",
        field: err.keyValue,
      });
    }

    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const searchUsers = async (req, res) => {
  try {
    const { username, churchName, birthdate } = req.query;
    if( !username || !churchName || !birthdate) return res.status(401).json({message:'not found'})
    const query = {};
        if (username) query.name = { $regex: username, $options: "i" };
        if (churchName) query.churchName = { $regex: churchName, $options: "i" };
        if (birthdate) query.birthDate = { $regex: birthdate, $options: "i" };

    const users = await userModel.find(query);
    res.status(200).json({users});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const insertSheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file found" });
    } else {
      const filePath = "upload/" + req.file.filename;
      console.log(
        "excelData:------------------------------------------------------------------------------"
      );

      const excelData = excelToJson({
        sourceFile: filePath,
        header: {
          rows: 1,
        },
        columnToKey: {
          A: "churchName",
          B: "name",
          C: "code",
          D: "birthDate",
        },
      });
      console.log("excelData:", excelData);
      console.log("excelData.data:", excelData.Data.length);
      let arrayToInsert = [];

      for (let i = 0; i < excelData.Data.length; i++) {
        const singleRow = {
          name: excelData.Data[i]["name"],
          churchName: excelData.Data[i]["churchName"],
          code: excelData.Data[i]["code"],
          birthDate: excelData.Data[i]["birthDate"],
        };
        arrayToInsert.push(singleRow);
      }

      const data = await userModel.insertMany(arrayToInsert);
      console.log(data);

      await fs.unlink(filePath);
      res.status(201).json({ message: "success", data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Sorry, something went wrong..."});
  }
};

module.exports = {
  getAllUsersWithoutPagnation,
  getAllUsers,
  addUser,
  deleteUser,
  updateUser,
  searchUsers,
  insertSheet,
};