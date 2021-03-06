const puppeteer = require('puppeteer');
const cron = require('node-cron');
const {query} = require('../utils/mysqlcon.js');
const fs = require('fs').promises;

const recipes = [];
// previous failures urls
const failures = require('./failures.json');

function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

const getAllLinks = async function(pages) {
  const browser = await puppeteer.launch({
    headless: true, // false open browser
    ignoreDefaultArgs: ['--enable-automation'],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299');
  await page.goto(`https://www.allrecipes.com/recipes/133/drinks/cocktails/?page=${pages * 5}`, {
    waitUntil: 'domcontentloaded', timeout: 0,
  });
  const bodyHandle = await page.$('body');
  const {height} = await bodyHandle.boundingBox();
  await bodyHandle.dispose();
  const viewportHeight = page.viewport().height;
  let viewportIncr = 0;

  while (viewportIncr + viewportHeight < height * 5) {
    await page.evaluate((_viewportHeight) => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);
    await wait(100);
    viewportIncr += viewportHeight;
  }
  await page.evaluate(async () => {
    window.scrollTo(0, 0);
  });

  try {
    const urls = await page.evaluate(async () => {
      const array = Array.from(document.querySelectorAll('#fixedGridSection > article > div.grid-card-image-container > a '));
      return array.map((a) => a.getAttribute('href')).filter((a) => a.includes('com/recipe'));
    });
    await browser.close();

    return urls;
  } catch (e) {
    console.log(e);
    console.log(`This is ${pages} no more pages!`);
    await browser.close();
    return [];
  }
};

const crawler = async function() {
  let urls = [];
  for (let pages = 1; pages < 2; pages++) {
    const linksArray = await getAllLinks(pages);
    urls = [...new Set([...urls, ...linksArray])];
  }

  const alreadySave = await query('select link from cocktails');
  const alreadyArray = alreadySave.map((a) => a.link);

  const filters = [...new Set([...failures, ...alreadyArray])];
  urls = urls.filter((e) => !filters.includes(e));
  console.log(urls);

  if (urls.length === 0) {
    console.log('all done');
    return;
  }
  for (let i = 0; i < urls.length; i++) {
    await newPageGO(urls[i]);

    console.log(urls[i]);
  }
  return recipes;
};

async function newPageGO(url) {
  const browser = await puppeteer.launch({
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'domcontentloaded', timeout: 0,
  });
  // Get the height of the rendered page
  const bodyHandle = await page.$('body');
  const {height} = await bodyHandle.boundingBox();
  await bodyHandle.dispose();
  // Scroll one viewport at a time, pausing to let content load
  const viewportHeight = page.viewport().height;
  let viewportIncr = 0;
  while (viewportIncr + viewportHeight < height) {
    await page.evaluate((_viewportHeight) => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);
    await wait(200);
    viewportIncr += viewportHeight;
  }
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  // Some extra delay to let images load
  await wait(300);
  const name = await page.evaluate(async () => {
    try {
      return await document.querySelector('body > div.docked-sharebar-content-container > div > main > div.recipe-container.two-col-container > div.content.two-col-main-content.karma-content-container.railDockSection-0 > div.recipe-content.two-col-content.karma-main-column > div.main-header.recipe-main-header > div.intro.article-info > div > h1').innerText || 'no name!';
    } catch (error) {
      console.log(`name error${error.message}`);
    }
  });
  const category = await page.evaluate(async () => {
    try {
      const categories = ['Shot', 'Rum', 'Tequila', 'Vodka', 'Champangne', 'Whiskey', 'Brandy', 'Gin', 'Wine'];
      const rumLike = ['mojito', 'caribbean'];
      const tequilaLike = ['mexican'];
      const categoryText = await document.querySelector('body > div.docked-sharebar-content-container > div > main > div.recipe-container.two-col-container > div.content.content-breadcrumbs > div > nav > ol > li.breadcrumbs__item.breadcrumbs__item--last > a > span.breadcrumbs__title').innerText || 'no category!';
      console.log(categoryText);
      let category = categories.filter((x) => {
        if (categoryText.toLowerCase().includes(x.toLowerCase())) {
          return x;
        }
      });
      console.log(category);

      if (category.length > 0) {
        return category[0];
      }
      category = rumLike.filter((r) => categoryText.toLowerCase().includes(r));
      if (category.length > 0) {
        return 'Rum';
      }
      category = tequilaLike.filter((r) => categoryText.toLowerCase().includes(r));

      if (category.length > 0) {
        return 'Tequila';
      }
      return 'Special';
    } catch (error) {
      console.log(`category error${error.message}`);
    }
  });
  console.log(category);
  console.log(name);
  const description = await page.evaluate(async () => {
    try {
      return await document.querySelector('body > div.docked-sharebar-content-container > div > main > div.recipe-container.two-col-container > div.content.two-col-main-content.karma-content-container.railDockSection-0 > div.recipe-content.two-col-content.karma-main-column > div.main-header.recipe-main-header > div.recipe-summary.margin-8-bottom > p').innerText || 'no des!';
    } catch (error) {
      console.log(`description error${error.message}`);
    }
  });
  const ingredients = await page.evaluate(async () => {
    try {
      const all = document.querySelectorAll('#ar-calvera-app > section.component.recipe-ingredients-new.container.interactive > fieldset > ul > li');
      const ingredients = [];
      for (let i = 0; i < all.length; i++) {
        ingredients.push(all[i].querySelector('label > span >span').innerText);
      }
      return JSON.stringify(ingredients);
    } catch (error) {
      console.log(`ingredients error${error.message}`);
    }
  });
  const steps = await page.evaluate(async () => {
    try {
      const all = document.querySelectorAll('body > div.docked-sharebar-content-container > div > main > div.recipe-container.two-col-container > div.content.two-col-main-content.karma-content-container.railDockSection-0 > div.recipe-content.two-col-content.karma-main-column > div.two-col-content-wrapper > div.recipe-content-container > section.recipe-instructions.recipe-instructions-new.component.container > fieldset > ul > li');
      const steps = [];
      for (let i = 0; i < all.length; i++) {
        steps.push(all[i].querySelector('div.section-body > div > p').innerText);
      }
      return JSON.stringify(steps);
    } catch (error) {
      console.log(`steps error${error.message}`);
    }
  });
  const author = await page.evaluate(async () => {
    try {
      return await document.querySelector('body > div.docked-sharebar-content-container > div > main > div.recipe-container.two-col-container > div.content.two-col-main-content.karma-content-container.railDockSection-0 > div.recipe-content.two-col-content.karma-main-column > div.main-header.recipe-main-header > div.author.scale-12.padded.margin-24-tb.clearfix > div > span > span ').innerText || 'no!';
    } catch (error) {
      console.log(`author error${error.message}`);
    }
  });
  const ori_image = await page.evaluate(async () => {
    try {
      return await document.querySelector('.recipe-review-open-in-new').href;
    } catch (error) {
      console.log(`ori_image error${error.message}`);
    }
  });

  const product = {
    name, ori_image, description, steps, ingredients, link: url, resource: 'allrecipes', author, category, author_id: 2,
  };

  if (!name || !ori_image || !steps) {
    console.log(`${url}is not fit!`);
    await browser.close();
    failures.push(url);
  } else {
    recipes.push(product);
    await browser.close();
  }
}
// Running at 0 a.m. every 28th per month
cron.schedule('0 0 0 28 * *', () => {
  (async () => {
    const result = await crawler();
    console.log(result);
    fs.writeFile('./failures/failures.json', JSON.stringify(failures, null, 2));
    const cocktail_sql = 'Insert INTO cocktails (name, ori_image , description , steps , ingredients , link, resource, author ,category ,author_id) VALUES ?';
    const queryResult = await query(cocktail_sql, [result.map((x) => Object.values(x))]);
    console.log(queryResult);
  })();
});
