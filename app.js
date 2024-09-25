const express = require("express");
const getCategories = require("./scrapper/scrapper");

const app = express();

async function getData() {
  const data = await getCategories();
  console.log(data);
  return data;
}

getData();

app.get("/get-categories", (req, res) => {
  res.send(data);
});

app.listen(3000);
