import jwt from 'jsonwebtoken'
import templateAPI from '../utils/template.API.js';

function authenticateToken(req,res,next){
    const authHeader   = req.headers['authorization'];
    
    if(authHeader==null)
        {
            //{error:"Null token"}
            var message = "Null token";
            var data = null;
            return res.status(401).json(templateAPI.configTemplateAPI(message,data));
        }
    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,   (error,user)=>{
        if(error){
            return res.status(403).json(templateAPI.configTemplateAPIError(error));
        }
        req.user = user;
        next();
    })
}

export {authenticateToken};