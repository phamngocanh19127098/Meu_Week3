import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import authRoute from "../routes/auth.route.js";
import userRoute from "../routes/users.route.js";

export default function (app) {
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
}
