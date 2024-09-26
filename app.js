const express = require("express");
const getCategories = require("./scrapper/scrapper");

const app = express();

async function getData() {
  try {
    const data = await getCategories();
    console.log("data was fetched");
    return data;
  } catch (error) {
    console.error(error);
  }
}

app.use("/get-categories", (req, res, next) => {
  console.log("some call in some-categories endpoint");
  next();
});

app.get("/get-categories", (req, res) => {
  getData()
    .then((call) => call.json())
    .then((call) => res.send(call));
  console.log("data was sended");
});

app.listen(3000);
console.log("app started on port 3000");
