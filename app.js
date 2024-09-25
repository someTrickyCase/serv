const express = require("express");
const getCategories = require("./scrapper/scrapper");

const app = express();

async function getData() {
  console.log("scrapping data...");
  try {
    const data = await getCategories();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
getData();

app.use("/get-categories", (req, res, next) => {
  console.log("some call in some-categories endpoint");
  next();
});

app.get("/get-categories", (req, res) => {
  res.send(data);
});

app.listen(3000);
console.log("app started on port 3000");
