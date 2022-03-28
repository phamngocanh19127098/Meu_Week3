import bcrypt from "bcrypt";

import router from "./users.route.js";
import { jwtTokens } from "../utils/jwt-heplers.js";
import model from "../provider/users.model.js";
import jwt from "jsonwebtoken";
import templateAPI from "../utils/template.API.js";
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await model.findUserByEmail(email);

    /*	#swagger.parameters['body'] = {
            in: 'body',
            description: 'Provide email and password to get access tokens and refresh tokens',
            required: true,
            
    } */

    if (users.length === 0) {
      var message = "Email or password is incorrect"
      var status = "Fail"
      var data = ""
      var error ="";
      return res.status(401).json(
        templateAPI.configTemplateAPI(message,status,data,error)
       
      );
    }
    const validPassword = await bcrypt.compare(password, users[0].password);
    if (!validPassword)
      {
        var message = "Email or password is incorrect"
        var status = "Fail"
        var data = ""
        var error ="";
        return res.status(401).json(
     
        templateAPI.configTemplateAPI(message,status,data,error)
      );
    }

    const tokens = jwtTokens(users[0]);
    //  tokens.refreshToken = tokens.refreshToken.split(' ')[1];
    res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
    var message = "Login success"
        var status = "Success"
        var data = tokens;
        var error ="";
    return res.status(200).json(

    templateAPI.configTemplateAPI(message,status,data,error)
    );
    
  } catch (error) {
      var message = ""
      var status = "Fail"
      var data = "";
      var error =error.message;
    return res.status(403).json(
    
    templateAPI.configTemplateAPI(message,status,data,error)
    );
  }
});
router.post("/refresh_token/:token", (req, res) => {
  // #swagger.description = 'Refresh access tokens'
  try {
    let refreshToken = req.cookies.refresh_token;
    const tokenParam = req.params.token;
    if (typeof refreshToken === "undefined") {
      return res.status(401).json({ error: "No refresh token" });
    }
    refreshToken = refreshToken.split(" ")[1];
    if (tokenParam === refreshToken) {
      jwt.verify(
        tokenParam,
        process.env.REFRESH_TOKEN_SECRET,
        (error, user) => {
          if (error) {
            var message = ""
            var status = "Fail"
            var data = "";
            var error =error.message;
            return res.status(403).json(
            templateAPI.configTemplateAPI(message,status,data,error)
            );
          }
          let tokens = jwtTokens(user);
          res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
          var message = "Refresh tokens success"
          var status = "Success"
          var data = tokens;
          var error ="";
          return res.status(200).json(
            templateAPI.configTemplateAPI(message,status,data,error)
          );
        }
      );
    }
  } catch (error) {
    var message = ""
    var status = "Fail"
    var data = "";
   // var error =;
    return res.status(403).json(templateAPI.configTemplateAPI(message,status,data,error.message));
  }
});

router.delete("/refresh_token", (req, res) => {
  // #swagger.description = 'Delete refresh token from cookie'
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({ 
      message: "Delete refresh tokens successful",
      responeData: "",
      status: "Success",
      timeStamp: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
      violations: "",
     });
  } catch (error) {
    return res.status(401).json({ 
      message: error.message,
      responeData: "",
      status: "Fail",
      timeStamp: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
      violations: error.message,
     });
  }
});
export default router;
