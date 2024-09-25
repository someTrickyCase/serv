const express = require("express");
const getCategories = require("./scrapper/scrapper");

const app = express();

async function getData() {
  try {
    const data = await getCategories();
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
  const data = getData();
  res.send(JSON.stringify(data));
});

app.listen(3000);
console.log("app started on port 3000");
