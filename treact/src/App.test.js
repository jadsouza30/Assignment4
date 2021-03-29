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
    headless: true, // headless mode set to false so browser opens up with visual feedback
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
  });

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
});

  // test("search hides results on clear", async () => {
  //   await page.screenshot({
  //     path: "/test/clear-search-test.png",
  //   });
  //   browser.close();
  // });
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
  describe("SignUp", () => {
    test("users can signup", async () => {
      await page.goto(routes.public.login);
      await page.waitForSelector(".logincontainer");

      await page.click("input[name=email]");
      await page.type("input[name=email]", "yomi@mail.com");
      await page.click("input[name=password]");
      await page.type("input[name=password]", "password");
      await page.click("button[type=signup]");
      await page.waitForSelector(".root");
    }, 1600000);
    test("users can login", async () => {
      await page.goto(routes.public.login);
      await page.waitForSelector(".logincontainer");

      await page.click("input[name=email]");
      await page.type("input[name=email]", "yomi@mail.com");
      await page.click("input[name=password]");
      await page.type("input[name=password]", "password");
      await page.click("button[type=login]");
      await page.waitForSelector(".root");
    }, 1600000);
  });
  describe("Unathorized view", () => {
    test("users that are not logged in are redirected to sign in page", async () => {
      await page.goto(routes.private.main);
      await page.waitForSelector(".logincontainer");
    }, 9000000);
  });

  afterAll(() => {
    browser.close();
  });
});
