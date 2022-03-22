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
   
    return res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  // #swagger.description = 'Sign up new account'
  try {
    const user = req.body;
    let userByEmail = await model.findUserByEmail(user.email);
    if (userByEmail.length == 0) {
      user.password = await bcrypt.hash(user.password, 10);

      await model.addNewUser(user);
      const newUser = await model.findUserByEmail(user.email);

      await model.addNewUserRole(newUser[0].id, "Normal");
      let message = {
        from: "pnanh19@clc.fitus.edu.vn",
        to: newUser[0].email,
        subject: "Comfirm your email",
        html: `<p>Verify your mail here http://localhost:3000/api/users/verify/${newUser[0].id}</p>`,
      };
      transporter.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
      res.json({ message: "Please comfirm your mail" });
    } else res.send("Email has already exist");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
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
      return res.json({ message: "User does not exist" });
    } else if (user[0].verified === "0") {
      await model.updateUserStatus(id);
      return res.json({ message: "Verify Success" });
    } else return res.json({ message: "This account is verified" });
  } catch (error) {
    res.status(404).json({ message: "Invalid id" });
  }
});

export default router;
