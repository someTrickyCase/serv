const express = require("express");
const cors = require("cors");
const getCategories = require("./scrapper/scrapInitialData");
const getCategory = require("./scrapper/scrapCategoryData");

const app = express();
app.use(cors());

let queriesCounter = 0;

app.use("", (req, res, next) => {
    queriesCounter++;
    console.log("queries counted", queriesCounter);
    next();
});

//  INITIAL REQUEST

async function getInitialData() {
    try {
        const data = await getCategories();
        return data;
    } catch (error) {
        console.error(error);
    }
}

app.get("/get-categories", (req, res) => {
    (async () => {
        const data = await getInitialData();
        res.send(JSON.stringify(data));
    })();
    console.log("INITIAL REQUEST");
});

// CATEGORY REQUEST

async function getCategoryData(categoryURL) {
    try {
        const data = await getCategory(categoryURL);
        return data;
    } catch (error) {
        console.error(error);
    }
}

app.get("/product-category", (req, res) => {
    (async () => {
        const categoryURL = req.headers.categorylink;
        const page = req.headers.page;

        const data = await getCategoryData(`${categoryURL}page/${page}`);
        res.send(JSON.stringify(data));
    })();
    console.log("CATEGORY REQUEST");
});

app.listen(8000);
console.log("app started on port 8000");
