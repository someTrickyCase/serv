const axios = require("axios");
const cheerio = require("cheerio");

async function getHTML(url) {
    const HTML = await axios.get(url);
    const $ = cheerio.load(HTML.data);
    return $;
}

async function getSearchResult(url) {
    if (!url) return;

    const productsImages = [];
    const productsTitle = [];
    const productsLink = [];
    const productsPrice = [];

    const searchResultPage = await getHTML(url);

    searchResultPage("#mobile").each((i, el) => {
        searchResultPage(el)
            .find(".w-grid-item-h")
            .each((i, el) => {
                productsImages.push(el.children[1].children[0].children[0].attribs.src);
                productsTitle.push(el.children[2].children[0].children[0].children[0].data);
                productsLink.push(el.children[2].children[0].children[0].attribs.href);
                productsPrice.push(
                    el.children[2].children[1].children[0].children[0].children[0].data
                );
            });
    });

    const products = [];
    for (let i = 0; i < productsTitle.length; i++) {
        products.push({
            title: productsTitle[i],
            images: productsImages[i],
            price: productsPrice[i],
        });
    }
    return products;
}

module.exports = getSearchResult;
