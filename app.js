const express = require("express");
const getCategories = require("./scrapper/scrapper");

const app = express();

let data;

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
  if (!data) {
    data = getData();
  }
  next();
});

app.get("/get-categories", (req, res) => {
  console.log("trying to send...");
  res.send("DATA");
  console.log("data was sended");
});

app.listen(3000);
console.log("app started on port 3000");
