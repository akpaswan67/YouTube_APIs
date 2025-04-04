import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/register", async (req, res) => {
	try {
	  console.log("request coming");
	  const hashedPassword = await bcrypt.hash(req.body.password, 10);
	  console.log(hashedPassword);
	  const uploadImage = await cloudinary.uploader.upload(
		req.files.logoUrl.tempFilePath
	  );
	  console.log("IMAGE👉", uploadImage);
  
	  const newUser = new User({
		_id: new mongoose.Types.ObjectId(),
		email: req.body.email,
		password: hashedPassword,
		channelName: req.body.channelName,
		phone: req.body.phone,
		logoUrl: uploadImage.secure_url,
		logoId: uploadImage.public_id,
	  });
  
	  let user = await newUser.save();
  
	  res.status(201).json({
		user,
	  });
	} catch (error) {
	  console.log(error);
	  res
		.status(500)
		.json({ error: "something went wrong", message: error.message });
	}
  });

  router.post("/login", async (req, res) => {
	try {
	  const existingUser = await User.findOne({ email: req.body.email });
  
	  if (!existingUser) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  const isValid = await bcrypt.compare(
		req.body.password,
		existingUser.password
	  );
  
	  if (!isValid) {
		return res.status(500).json({ message: "Invalid credentials" });
	  }
  
	  const token = jwt.sign(
		{
		  _id: existingUser._id,
		  channelName: existingUser.channelName,
		  email: existingUser.email,
		  phone: existingUser.phone,
		  logoId: existingUser.logoId,
		},
		process.env.JWT_TOKEN,
		{ expiresIn: "10d" }
	  );
  
	  res.status(200).json({
		  _id: existingUser._id,
		  channelName: existingUser.channelName,
		  email: existingUser.email,
		  phone: existingUser.phone,  
		  logoId: existingUser.logoId,
		  logoUrl:existingUser.logoUrl,
		  token:token,
		  subscribers:existingUser.subscribers,
		  subscribedChannels:existingUser.subscribedChannels
	  })
	} catch (error) {
	  console.log(error);
	  res
		.status(500)
		.json({ error: "something went wrong", message: error.message });
	}
  });
  



export default router;