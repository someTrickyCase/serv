const express = require("express");
const getCategories = require("./scrapper/scrapper");
const cors = require("cors");

const app = express();
app.use(cors());

async function getData() {
  try {
    const data = await getCategories();
    console.log("data was fetched");
    return data;
  } catch (error) {
    console.error(error);
  }
}

// app.use("/get-categories", (req, res, next) => {
//   console.log("some call in some-categories endpoint");
//   if (!data) {
//     data = getData().then(next());
//   } else {
//     next()
//   }
// });

app.get("/get-categories", (req, res) => {
  (async () => {
    const data = await getData();
    res.send(JSON.stringify(data));
  })();
  console.log("data was sended");
});

app.listen(3000);
console.log("app started on port 3000");
