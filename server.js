const express = require('express');
const {sendOTP} = require('./controller/userController')
const mongoose = require('mongoose')

const app = express();
const port = 3010;
app.use(express.json());

app.head('/api/user', async (req, res, next) => {
  try {
    const email = req.query.email
    await sendOTP(email);
    res.status(204).send()
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
    .connect('mongodb://localhost:27017/authetication', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('db connected');
    })
    .catch((err) => {
      console.error('db not connected', err);
    });
};
