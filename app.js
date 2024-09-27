const express = require("express");
const cors = require("cors");
const getCategories = require("./scrapper/scrapper");
// const getCategory = require("./scrapper/scrapper");

const app = express();
app.use(cors());

let queriesCounter = 0;

app.use("", (req, res, next) => {
    queriesCounter++;
    console.log("queries counted", queriesCounter);
    next();
});

async function getCategoriesData() {
    try {
        const data = await getCategories();
        console.log("categories data was fetched");
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function getCategoryData(categoryURL) {
    try {
        const data = await getCategory(categoryURL);
        console.log("category data was fetched");
        return data;
    } catch (error) {
        console.error(error);
    }
}

app.get("/get-categories", (req, res) => {
    (async () => {
        const data = await getCategoriesData();
        res.send(JSON.stringify(data));
    })();
    console.log("categories data was sended");
});

app.get("/product-category", (req, res) => {
    (async () => {
        const category = JSON.parse(req.body.category);
        const page = JSON.parse(req.body.page);

        const data = await getCategoryData(
            `https://troffi.ru/product-category/${category || " land-cruiser-prado-150"}/page/${
                page || "1"
            }`
        );
        res.send(JSON.stringify(data));
    })();
    console.log("category data was sended");
});

app.listen(8000);
console.log("app started on port 8000");
