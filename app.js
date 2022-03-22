import express from 'express';
import {dirname} from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import dotenv from 'dotenv';
import swaggerFile from './swagger-output.json'
import swaggerUiExpress from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import activeRoute from './middlewares/route.mdw.js'
const app = express();
app.use(express.json())
app.use(cookieParser())
dotenv.config();

activeRoute(app);



app.use("/doc", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerFile));


   

const port = 3000;
app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
});
