const puppeteer = require('puppeteer');

let browser
let page
beforeAll (async() => {
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 250,
    devtools: true,
  })
  page = await browser.newPage();
  try {
    await page.goto('http://localhost:3000/components/innerPages/BlogIndexPage', {waitUntil: 'networkidle0'})
    await page.waitForSelector('.Search');
  } catch (err) {
    console.error(err);
    throw new Error ('localhost timed out');
  }

  page.setViewport({ width: 500, height: 2400 })
})

describe('on search page', () => {

  test('title loads accurately', async() => {
    const html = await page.$eval('.BlogIndex__HeadingRow-sc-11jbi6t-0', e => e.textContent);
    expect(html).toBe('Find Events and Users');
    }, 16000);

  test('search returns results container', async() => {
    try {
      await page.type('.SearchInput', 'test');
      await page.click('.SearchSpan');
    } catch(err) {
      console.error(err);
      throw new Error ('selection not found');
    }
    jest.setTimeout(1500);
    const results = await page.$eval('#results', e => e.textContent);
    expect(results).toBeTruthy();
  } );

  test('search hides results on clear', async() => {
    await page.screenshot({path: 'C:/Users/Liza/csci310/src/test/clear-search-test.png'});
    browser.close();
  });
  // test('search works for blank input', async() => {
  //
  // });
  // test('search filters work', async() => {
  //
  // });
  // test('load more button works', async() => {
  //
  // });
  // test('search returns accurate results', async() => {
  //
  // });
});
