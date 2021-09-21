const express = require('express');

const app = express();
const port = 8080;
app.use(express.json());

app.head('/api/user', async (req, res, next) => {
  try {
    const mobileNum = req.query.mobileNum
    if (!(mobileNum.length === 10 && !isNaN(Number(mobileNum)))) throw new Error()
    


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
