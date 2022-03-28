import express from "express";
import crypt from "../utils/crypt.js";
import dotenv from "dotenv";
import { authenticateToken } from "../middlewares/authorization.js";
import nodemailer from "nodemailer";
dotenv.config();
const router = express.Router();
import bcrypt from "bcrypt";
import model from "../provider/users.model.js";
import templatAPI from '../utils/template.API.js'
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: crypt.decrypt(process.env.HASHED_EMAIL),
    pass: crypt.decrypt(process.env.HASHED_PASSWORD),
  },
});

router.get("/", authenticateToken, async (req, res) => {
  // #swagger.description = 'Get all users (Bearer+space+access token to authorize) '
  /* #swagger.security = [{
              "bearerAuth": []
        }] */
   //  #swagger.parameters['filter'] = { description: 'testcase: (email|name)@=h,verified@=0 \n email==npham4533@gmail.com,verified@=0' }
  try {
    
    const page = req.query.page || 1;
    const size = req.query.size || 5;
    const filter = req.query.filter||'';
    const offset = (page - 1) * size;
    const users = await model.findAllUser(offset, size,filter);

   const alluser = await model.getAllUser();

   let nPages =  parseInt(alluser.length/size);
   if(alluser.length%size!=0){
     nPages++;
   }
    var message = "Get all users success"
      var status = "Success"
      var data = {
            count:users.length,
            rows:users,
            totalPages:nPages,
            currentPage:page
          }
      var error ="";
    return res.json(
      templatAPI.configTemplateAPI(message,status,data,error)
   
    );
  } catch (error) {
    var message = ""
      var status = "Fail"
      var data = ""
      
    res.status(500).json(
      
      templatAPI.configTemplateAPI(message,status,data,error.message)
      );
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
      let Message = {
        from: "pnanh19@clc.fitus.edu.vn",
        to: newUser[0].email,
        subject: "Comfirm your email",
        html: `<p>Verify your mail here http://localhost:3000/api/users/verify/${newUser[0].id}</p>`,
      };
      transporter.sendMail(Message);
      var message = "Please comfirm your mail"
      var status = "Success"
      var data = ""
      var error ="";
      res.status(200).json(
        templatAPI.configTemplateAPI(message,status,data,error)
      );
    } else
      
      {
        var message = "Email already exists"
        var status = "Fail"
        var data = ""
        var error ="";
        res.status(400).json(
      templatAPI.configTemplateAPI(message,status,data,error)
      );
    }
  } catch (error) {
    var message = ""
    var status = "Fail"
    var data = ""
    var error = error.message;
    res.status(400).json(
    templatAPI.configTemplateAPI(message,status,data,error)
    );
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
        var message = "User does not exist"
        var status = "Fail"
        var data = ""
        var error ="";
      return res.status(404).json(
      templatAPI.configTemplateAPI(message,status,data,error)
       );
    } else if (user[0].verified === "0") {
      await model.updateUserStatus(id);
      var message = "Verify Success"
      var status = "Success"
      var data = ""
      var error ="";
      return res.status(200).json(
        templatAPI.configTemplateAPI(message,status,data,error)
        );
    } else {
      var message = "This account is verified"
      var status = "Fail"
      var data = ""
      var error ="";
      return res.status(400).json(
    templatAPI.configTemplateAPI(message,status,data,error)
    );
  }
  } catch (error) {
    var message = "Invalid id"
    var status = "Fail"
    var data = ""
    var error ="";
    res.status(404).json(
   
    templatAPI.configTemplateAPI(message,status,data,error)
     );
     
  }
});

export default router;
