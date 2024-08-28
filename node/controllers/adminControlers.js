
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Admin = require("../models/adminModel");



const registerAdmin = async (req, res) => {
    const { adminName, password } = req.body;
    if (!adminName || !password) {
        return res.status(400).json({ message: "Please enter both adminName and password" });
    }
    try {
        const existAdmin = await Admin.findOne({ adminName });
        if (existAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const salt = await bcrypt.genSalt(20);
        const hashPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ adminName, password: hashPassword });
        await newAdmin.save();

        res.status(201).json({ message: "Admin created successfully" });



    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error registering admin: ' + err.message);
    }

};
const loginAdmin =async (req, res) => {
    const { adminName, password } = req.body;
    console.log({ adminName, password });
    
    if (!adminName || !password) {
        return res
          .status(400)
          .json({ message: "Please enter both adminName and password" });
    }
    try {
        const admin = await Admin.findOne({ adminName });
        if (!admin) {
            return res.status(400).json({ message: "Invalid adminName or password" });
        }
        const isMatch = bcrypt.compare(password, admin.password);
        if (!isMatch) {
                        return res.status(400).json({ message: "Invalid adminName or password" });

        }
        const payload = { adminId: admin._id, adminName: admin.adminName };
        const token = jwt.sign(payload, process.env.SECRET);
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error logging in admin: ' + err.message);
    }
 };

module.exports = {
    registerAdmin,
    loginAdmin
};