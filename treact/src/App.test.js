const puppeteer = require("puppeteer");
const faker = require("faker");
const person = {
  email: faker.internet.email(),
  password: faker.random.word(),
};
const appUrlBase = "http://localhost:3000";
const routes = {
  public: {
    register: `${appUrlBase}/login2`,
    login: `${appUrlBase}/login2`,
  },
  private: {
    home: `${appUrlBase}/home`,
    account: `${appUrlBase}/account`,
    search: `${appUrlBase}/components/innerPages/BlogIndexPage`,
    main: `${appUrlBase}/main`,
  },
};

let browser;
let page;
beforeAll(async () => {
  // launch browser
  browser = await puppeteer.launch({
    headless: false, // headless mode set to false so browser opens up with visual feedback
    slowMo: 250, // how slow actions should be
    devtools: true,
  });
  // creates a new page in the opened browser
  page = await browser.newPage();
});

describe("on search page", () => {
  test("title loads accurately", async () => {
    await page.goto(
      "http://localhost:3000/components/innerPages/BlogIndexPage",
      { waitUntil: "networkidle0" }
    );
    await page.waitForSelector(".Search");
    const html = await page.$eval(
      ".BlogIndex__HeadingRow-sc-11jbi6t-0",
      (e) => e.textContent
    );
    expect(html).toBe("Find Events and Users");
  }, 16000);

  test("search returns results container", async () => {
    try {
      await page.type(".SearchInput", "test");
      await page.click(".SearchSpan");
    } catch (err) {
      console.error(err);
      throw new Error("selection not found");
    }
    jest.setTimeout(1500);
    const results = await page.$eval("#results", (e) => e.textContent);
    expect(results).toBeTruthy();
  });

  test("search hides results on clear", async () => {
    await page.screenshot({
      path: "C:/Users/Liza/csci310/src/test/clear-search-test.png",
    });
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
