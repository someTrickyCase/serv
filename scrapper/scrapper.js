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

  console.log({ vcms, pickups });
  return { vcms, pickups };
}

module.exports = getCategories;
