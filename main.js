const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3001;

/*
 * Middleware
 */

function ensureToken(req, res, next) {
  console.log("ensureToken");
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const haha = bearer[0];
    const bearerToken = bearer[1];
    req.something = haha;
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

/*
 * Services
 */

const signAccessTokenService = async (payload) => {
  return new Promise((resolve, reject) => {
    const secret = "my_secrete_key";
    jwt.sign(payload, secret, (err, token) => {
      if (err) throw err;
      resolve(token);
    });
  });
};

/*
 * Routes
 */

app.get("/api", function (req, res) {
  res.json({
    text: "my api!",
  });
});

app.post("/api/login", async function (req, res) {
  // auth user
  const user = { id: 3, name: "Thangh handsome", password: "thang123" };
  const payload = user;
  // const secretekey = "my_secrete_key";
  // const options = {
  //   expiresIn: "10h",
  // };

  // const token = jwt.sign(payload, secretekey, options);

  // const token = jwt.sign(payload, secretekey, options, (err, token) => {
  //   if (err) {
  //     throw err;
  //   }
  // });
  // console.log("token :>> ", token);
  const token = await signAccessTokenService(payload);
  res.json({
    token: token,
  });
});

app.get("/api/protected", ensureToken, function (req, res) {
  console.log("Just call the /api/protected");
  console.log("haha :>> ", req.something);

  jwt.verify(req.token, "my_secrete_key", function (err, data) {
    if (err) {
      res.sendStatus("403");
    } else {
      res.json({
        text: "This is protected",
        data: data,
      });
    }
  });
});

app.listen(PORT, function () {
  console.log(`Server is listening on the port: ${PORT}`);
});
