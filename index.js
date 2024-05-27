const express = require("express");
const { userRouter } = require("./Routes/user.route");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const { connection } = require("./db/db");

const jwt = require("jsonwebtoken");
const { blogRouter } = require("./Routes/post.route");
const app = express();

app.use(express.json());


app.use("/users",userRouter)
app.use("/posts",blogRouter)


app.get("/regenerate", (req, res) => {
  const RefreshToken = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(RefreshToken, process.env.RefreshKey);
  console.log(decoded)

  if (decoded) {
    const acessToken = jwt.sign(
      { course: "backendAuth2" },
      process.env.AcessKey,
      { expiresIn: 60 }
    );
    res.status(200).send({ msg: `The token has been generated- ${acessToken} `});
  } else {
    res.status(400).send({ msg: "Invalid Refresh Token" });
  }
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("connectred to DB");
    console.log(`server is running at port ${PORT}`);
  } catch (error) {
    console.log("error", error.message);
  }
});
