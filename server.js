const express = require("express");
const { sendOTP, verifyOTP, register, login } = require("./controller/userController");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3010;
app.use(express.json());

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) res.status(403).send();

  try {
    const data = jwt.verify(token, "sadaf");
    req.body.userId = data.userId;
    next();
  } catch (err) {
    res.status(403).send();
  }
};

app.head("/api/user", async (req, res, next) => {
  try {
    const email = req.query.email;
    await sendOTP(email);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

app.post("/api/verifyOTP", async (req, res, next) => {
  try {
    const otp = req.body.otp;
    const email = req.body.email;
    const data = await verifyOTP(otp, email);
    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
});

app.post("/api/register", auth, async (req, res, next) => {
  try {
    const { name, password, userId } = req.body;
    await register(name, password, userId);
    res.status(200).send()
  } catch (err) {
    next(err);
  }
});

app.post('/api/login', async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const token = await login(email, password)
    res.status(200).send({token})
  } catch (err) {
    next(err);
  }
})

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err);
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
  setupMongoose();
});

const setupMongoose = () => {
  mongoose
    .connect("mongodb://localhost:27017/authetication", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("db connected");
    })
    .catch((err) => {
      console.error("db not connected", err);
    });
};
