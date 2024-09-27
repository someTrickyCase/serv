const axios = require("axios");
const cheerio = require("cheerio");

async function getHTML(url) {
    const HTML = await axios.get(url);
    const $ = cheerio.load(HTML.data);
    return $;
}

async function getCategories() {
    const categoriesPage = await getHTML("https://troffi.ru/");

    const vcmTitles = [];
    const vcmCategoryImgs = [];
    const vcmCategoryLogo = [];
    const vcmLinks = [];
    const vcms = [];

    const pickupsTitles = [];
    const pickupsCategoryImgs = [];
    const pickupsCategoryLogo = [];
    const pickupsLinks = [];
    const pickups = [];

    // ____VMC
    categoriesPage("section")
        .eq(2)
        .each((i, el) => {
            // ____LINK
            categoriesPage(el)
                .find("a")
                .each((i, el) => {
                    const link = categoriesPage(el).attr("href");
                    vcmLinks.push(link);
                });

            // ____IMAGE & LOGO IMAGE
            categoriesPage(el)
                .find("img")
                .each((i, el) => {
                    if (i % 2 !== 0) {
                        const categoryImg = categoriesPage(el).attr("src");
                        vcmCategoryImgs.push(categoryImg);
                    } else {
                        const categoryImg = categoriesPage(el).attr("src");
                        vcmCategoryLogo.push(categoryImg);
                    }
                });

            // ____TITLE
            categoriesPage(el)
                .find(".w-text-value")
                .each((i, el) => {
                    if (i === 0) return;
                    const title = categoriesPage(el).text();
                    vcmTitles.push(title);
                });

            for (let i = 0; i < vcmTitles.length; i++) {
                const vcm = {
                    title: vcmTitles[i],
                    logo: vcmCategoryLogo[i],
                    img: vcmCategoryImgs[i],
                    link: vcmLinks[i],
                };
                vcms.push(vcm);
            }
        });

    // ________ PICKUPS
    categoriesPage("section")
        .eq(3)
        .each((i, el) => {
            // ____LINK
            categoriesPage(el)
                .find("a")
                .each((i, el) => {
                    const link = categoriesPage(el).attr("href");
                    pickupsLinks.push(link);
                });

            // ____IMAGE & LOGO IMAGE
            categoriesPage(el)
                .find("img")
                .each((i, el) => {
                    if (i % 2 !== 0) {
                        const categoryImg = categoriesPage(el).attr("src");
                        pickupsCategoryImgs.push(categoryImg);
                    } else {
                        const categoryImg = categoriesPage(el).attr("src");
                        pickupsCategoryLogo.push(categoryImg);
                    }
                });

            // ____TITLE
            categoriesPage(el)
                .find(".w-text-value")
                .each((i, el) => {
                    if (i === 0) return;
                    const title = categoriesPage(el).text();
                    pickupsTitles.push(title);
                });

            for (let i = 0; i < pickupsTitles.length; i++) {
                const pickup = {
                    title: pickupsTitles[i],
                    logo: pickupsCategoryLogo[i],
                    img: pickupsCategoryImgs[i],
                    link: pickupsLinks[i],
                };
                pickups.push(pickup);
            }
        });

    // console.log({ vcms, pickups });
    return { vcms, pickups };
}

async function getCategory(categoryLink) {
    const categoryPage = await getHTML(categoryLink);

    // Menu
    const menu = {};
    categoryPage(".level_1", ".menu-item-type-taxonomy").each((i, el) => {
        categoryPage(el)
            .find(".w-nav-title")
            .each((i, el) => {
                const title = el.children[0].data;
                const link = el.parent.attribs.href;
                menu[title] = { link, tabs: [] };
                categoryPage(el.parent.parent).each((i, el) => {
                    el.children[1]?.children.map((item) => {
                        menu[title].tabs.push({
                            title: item.children[0].children[0].children[0].data,
                            link: item.children[0].attribs.href,
                        });
                    });
                });
            });
    });

    // Products List
    const productsTitles = [];
    const productsImages = [];
    const productsPrice = [];
    const productsArticle = [];
    const productDescription = [];

    categoryPage(".w-grid-list").each((i, el) => {
        if (i === 0) return;

        //  Products Titles
        categoryPage(el)
            .find("h3")
            .each((i, el) => {
                productsTitles.push(el.children[0].children[0].data);
            });

        // Images
        categoryPage(el)
            .find(".post_image")
            .each((i, el) => {
                if (el.children[0].children.length === 4) {
                    productsImages.push([
                        el.children[0].children[1].attribs.src,
                        el.children[0].children[3].attribs.src,
                    ]);
                } else if (el.children[0].children.length === 1) {
                    productsImages.push(el.children[0].children[0].attribs.src);
                }
            });

        // Products price
        categoryPage(el)
            .find(".price")
            .each((i, el) => {
                if (el.children.length === 1) {
                    categoryPage(el)
                        .find("bdi")
                        .each((i, el) => {
                            productsPrice.push(el.children[0].data);
                        });
                } else {
                    categoryPage(el)
                        .find("ins")
                        .each((i, el) => {
                            productsPrice.push(el.children[0].children[0].children[0].data);
                        });
                }
            });

        // Producrs article
        categoryPage(el)
            .find(".product_meta")
            .each((i, el) => {
                productsArticle.push(el.children[1].children[0].data);
            });

        // Products description
        categoryPage(el)
            .find(".post_content")
            .each((i, el) => {
                productDescription.push(el.children[0].data);
            });
    });

    const products = [];
    for (let i = 0; i < productsTitles.length; i++) {
        products.push({
            title: productsTitles[i],
            images: productsImages[i],
            description: productDescription[i],
            article: productsArticle[i],
            price: productsPrice[i],
        });
    }
    return { products, menu };
}

module.exports = getCategories;
module.exports = getCategory;
