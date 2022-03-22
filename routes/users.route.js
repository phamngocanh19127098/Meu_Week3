import express from "express";
import crypt from "../utils/crypt.js";
import dotenv from "dotenv";
import { authenticateToken } from "../middlewares/authorization.js";
import nodemailer from "nodemailer";
dotenv.config();
const router = express.Router();
import bcrypt from "bcrypt";
import model from "../provider/users.model.js";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: crypt.decrypt(process.env.HASHED_EMAIL),
    pass: crypt.decrypt(process.env.HASHED_PASSWORD),
  },
});

router.get("/", authenticateToken, async (req, res) => {
  // #swagger.description = 'Get all users (Bearer+space+access token to authorize)'
  /* #swagger.security = [{
              "bearerAuth": []
        }] */
  try {
    const page = req.query.page || 1;
    const size = req.query.size || 5;
    const offset = (page - 1) * size;
    const users = await model.findAllUser(offset, size);
   // users
   let nPages =  parseInt(users.length/size);
   if(users.length%size!=0){
     nPages++;
   }
    return res.json({
      message:"Get all users successful",
      responeData:{
        count:users.length,
        rows:users,
        totalPages:nPages,
        currentPage:page
      },
      timeStamp:new Date()
              .toISOString()
              .replace(/T/,' ')
              .replace(/\..+/,''),
      violations:"",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  // #swagger.description = 'Sign up new account'
  try {
    let { name, email, password } = req.body;
    let userByEmail = await model.findUserByEmail(email);
    if (userByEmail.length == 0) {
      password = await bcrypt.hash(password, 10);
      let user = { name, email, password};
      await model.addNewUser(user);
      const newUser = await model.findUserByEmail(email);

      await model.addNewUserRole(newUser[0].id, "Normal");
      let message = {
        from: "pnanh19@clc.fitus.edu.vn",
        to: newUser[0].email,
        subject: "Comfirm your email",
        html: `<p>Verify your mail here http://localhost:3000/api/users/verify/${newUser[0].id}</p>`,
      };
      transporter.sendMail(message);
      res.status(200).json({
        message: "Please comfirm your mail",
        responeData: "",
        status: "Success",
        timeStamp: new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        violations: "",
      });
    } else
      res.status(400).json({
        message: "Email already exists",
        responeData: "",
        status: "Fail",
        timeStamp: new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        violations: "",
      });
  } catch (error) {
    res.status(400).json({
      message: "",
      responeData: "",
      status: "Fail",
      timeStamp: new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, ""),
      violations: error.message,
    });
  }
});

router.get("/verify/:user_id", async (req, res) => {
  // #swagger.description = 'Verify user via user_id'
  const id = req.params.user_id || -1;
  try {
    if (id === -1) {
      return res.json({ message: "Invalid url" });
    }
    const user = await model.findUserById(id);

    if (user.length === 0) {
      return res.status(404).json({ 
        message: "User does not exist",
        responeData: "",
        status: "Fail",
        timeStamp: new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, ""),
        violations:"",

       });
    } else if (user[0].verified === "0") {
      await model.updateUserStatus(id);
      return res.status(200).json({
        message: "Verify Success",
        responeData: "",
        status: "Success",
        timeStamp: new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, ""),
        violations: "",
        });
    } else return res.status(400).json({ 
      message: "This account is verified",
        responeData: "",
        status: "Fail",
        timeStamp: new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, ""),
        violations: "", 
    });
  } catch (error) {
    res.status(404).json({ 
        message: "Invalid id",
        responeData: "",
        status: "Fail",
        timeStamp: new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, ""),
        violations: error.message,
     });
  }
});

export default router;
