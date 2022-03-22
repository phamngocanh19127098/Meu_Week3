import jwt from "jsonwebtoken";

function jwtTokens({ user_id, user_name, user_email }) {
  const user = { user_id, user_name, user_email };
  let accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2m",
  });
  let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10m",
  });
  accessToken = "Bearer " +accessToken;
  refreshToken = "Bearer "+refreshToken;
  return { accessToken, refreshToken };
}

export { jwtTokens };
