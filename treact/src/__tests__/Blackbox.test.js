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
const firebase=require("firebase");

const settings = {timestampsInSnapshots: true};

var firebaseConfig = {
  apiKey: "AIzaSyAip5qxPcgUN-U105qoszmQNyw0J5DYs6g",
  authDomain: "proevento-69c0b.firebaseapp.com",
  projectId: "proevento-69c0b",
  storageBucket: "proevento-69c0b.appspot.com",
  messagingSenderId: "681502722062",
  appId: "1:681502722062:web:1a7e45f8c43cd9efd2145f",
  measurementId: "G-DRXMTZZBW3"
};

if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings(settings);
}

const getResults=async(eventName)=>{
  let ids=[]
  let docs=await firebase.firestore().collection("Events").where("title","==",eventName.toString()).get()
  .then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
          ids.push(doc.data().MeetingNumber)
      })
  });
  return ids;
}

const getUsers=async(user)=>{
  let ids=[]
  let docs=await firebase.firestore().collection("users").where("name","==",user.toString()).get()
  .then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
          ids.push(doc.data().uid)
      })
  });
  return ids;
}

const getEventsForUser=async(uid)=>{
  let ids=[]
  let docs=await firebase.firestore().collection("Events").where("uid","==",uid.toString()).get()
  .then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
          ids.push(doc.data().MeetingNumber)
      })
  })
  return ids
}


jest.setTimeout(120000);

let browser;
let page;

beforeAll(async () => {
  // launch browser
  browser = await puppeteer.launch({
    headless: false, // headless mode set to false so browser opens up with visual feedback
    devtools: true,
  });
  // creates a new page in the opened browser
  page = await browser.newPage();
});

describe("Unathorized view", () => {
  test("users that are not logged in are redirected to sign in page", async () => {
    await page.goto(routes.private.main);
    await page.waitForSelector("#firebaseui-auth-container");
  }, 9000000);
});

test("users can login", async () => {
  await page.goto("http://localhost:3000/login2");
  await page.waitForSelector(".logincontainer");
  await page.click("input[name=email]");
  await page.type("input[name=email]", "jasondsouza0530@gmail.com");
  await page.click("input[name=password]");
  await page.type("input[name=password]", "jasondsouza0530@gmail.com");
  await page.click("button[type=login]");
  await page.waitForSelector(".root");
}, 1600000);

describe("Nav Tests", () => {
  test("does nav search work ", async () => {
    await page.goto(routes.private.main);
    const element_is_visible = await page.evaluate(() => {
      const element = document.querySelector('#SearchEvents');
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && !!(rect.bottom || rect.top || rect.height || rect.width);
    });
    if(element_is_visible){
      //await page.waitForSelector("#SearchEvents");
      await page.click("#SearchEvents");
      await page.waitForSelector("#BlogPage");
    }
  }, 9000000);
  test("does nav search work ", async () => {
    await page.goto(routes.private.main);
    const element_is_visible = await page.evaluate(() => {
      const element = document.querySelector('#SearchUsers');
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && !!(rect.bottom || rect.top || rect.height || rect.width);
    });
    if(element_is_visible){
      //await page.waitForSelector("#SearchEvents");
      await page.click("#SearchUsers");
      //await page.waitForSelector("#BlogPage");
    }
  }, 9000000);
  test("does profile work", async () => {
    await page.goto(routes.private.main);
    const element_is_visible = await page.evaluate(() => {
      const element = document.querySelector('#Profile');
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && !!(rect.bottom || rect.top || rect.height || rect.width);
    });
    if(element_is_visible){
      //await page.waitForSelector("#Profile");
      await page.click("#Profile");
      await page.waitForSelector("#ProfilePage");
    }
  }, 9000000);
  test("does feed work", async () => {
    await page.goto(routes.private.main);
    const element_is_visible = await page.evaluate(() => {
      const element = document.querySelector('#Feed');
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && !!(rect.bottom || rect.top || rect.height || rect.width);
    });
    if(element_is_visible){
      //await page.waitForSelector("Feed")
      await page.click("#Feed");
      await page.waitForSelector("#ProfilePage");
    }
  }, 9000000);
  test("does main work", async () => {
    await page.goto(routes.private.main);
    const element_is_visible = await page.evaluate(() => {
      const element = document.querySelector('#Main');
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && !!(rect.bottom || rect.top || rect.height || rect.width);
    });
    if(element_is_visible){
      //await page.waitForSelector("#Main")
      await page.click("#Main");
      await page.waitForSelector(".root");
    }
  }, 9000000);
});

describe("on search page", () => {
  test("title loads accurately", async () => {
    await page.goto(
      "http://localhost:3000/components/innerPages/BlogIndexPage",
      { waitUntil: "networkidle0" }
    );
    await page.waitForSelector("#heading_text");
    const html = await page.$eval(
      ".BlogIndex__HeadingRow-sc-11jbi6t-0",
      (e) => e.textContent
    );
    expect(html).toBe("Find Events and Users");
  },35000);

  test("search returns results container", async () => {
    try {
      await page.goto(
        "http://localhost:3000/components/innerPages/BlogIndexPage",
        { waitUntil: "networkidle0" }
      );
      await page.type(".SearchInput", "test");
      await page.click("#eButton")
      await page.click(".SearchSpan");
    } catch (err) {
      console.error(err);
      throw new Error("selection not found");
    }
    const results = await page.$eval("#eventsresults", (e) => e.textContent);
    expect(results).toBeTruthy();
  });

  test("fetches correct results for by event", async()=>{
    let links=await getResults("skateboard")
    try {
      await page.goto(
        "http://localhost:3000/components/innerPages/BlogIndexPage",
        { waitUntil: "networkidle0" }
      );
      await page.type(".SearchInput", "skateboard");
      await page.click("#eButton")
      await page.click(".SearchSpan");
    } catch (err) {
      console.error(err);
      throw new Error("selection not found");
    }
    await new Promise(resolve => setTimeout(resolve, 4000));
    const hrefs = await page.$$eval('a', as => as.map(a => a.href));

    links.forEach((link)=>{
      let contains=hrefs.includes("http://localhost:3000/components/innerPages/"+link.toString()) || hrefs.includes(link.toString())
      expect(contains).toBe(true)
    })
  })

  test("fetches correct results for by user", async()=>{
    let ids=await getUsers("Jason D'Souza")
    try {
      await page.goto(
        "http://localhost:3000/components/innerPages/BlogIndexPage",
        { waitUntil: "networkidle0" }
      );
      await page.type(".SearchInput", "Jason D'Souza");
      await page.click("#uButton")
      await page.click(".SearchSpan");
    } catch (err) {
      console.error(err);
      throw new Error("selection not found");
    }
    await new Promise(resolve => setTimeout(resolve, 4000));
    const hrefs = await page.$$eval('a', as => as.map(a => a.href));

    ids.forEach((id)=>{
      let contains=hrefs.includes("http://localhost:3000/components/innerPages/"+id.toString()) || hrefs.includes(id.toString())
      expect(contains).toBe(true)
    })
  })

  test("fetches correct results for by user", async()=>{
    let ids=await getUsers("Jason D'Souza")
    let links=await getResults("Jason D'Souza")
    try {
      await page.goto(
        "http://localhost:3000/components/innerPages/BlogIndexPage",
        { waitUntil: "networkidle0" }
      );
      await page.type(".SearchInput", "Jason D'Souza");
      await page.click("#uButton")
      await page.click("#eButton")
      await page.click(".SearchSpan");
    } catch (err) {
      console.error(err);
      throw new Error("selection not found");
    }
    await new Promise(resolve => setTimeout(resolve, 4000));
    const hrefs = await page.$$eval('a', as => as.map(a => a.href));

    ids.forEach((id)=>{
      let contains=hrefs.includes("http://localhost:3000/components/innerPages/"+id.toString()) || !hrefs.includes(id.toString())
      expect(contains).toBe(true)
    })

    links.forEach((link)=>{
      let contains=hrefs.includes("http://localhost:3000/components/innerPages/"+link.toString()) || !hrefs.includes(link.toString())
      expect(contains).toBe(true)
    })
  })

  test("profile loads users events", async()=>{
    let ids=await getEventsForUser("0ZJU1R3Qn6U3OaPTrMWMkgWoQXt2");
    try {
      await page.goto(
        "http://localhost:3000/profile/profile",
      );
    } catch (err) {
      console.error(err);
      throw new Error("selection not found");
    }
    await new Promise(resolve => setTimeout(resolve, 4000));
    const hrefs = await page.$$eval('a', as => as.map(a => a.href));

    ids.forEach((id)=>{
      let contains=hrefs.includes("http://localhost:3000/Meeting/landing/"+id.toString()) || hrefs.includes(id.toString())
      expect(contains).toBe(true)
    })
  })

  test("create event successfully", async()=>{
      try {
        await page.goto(
          "http://localhost:3000/components/innerPages/SignupPage"
        );
      } catch (err) {
        console.error(err);
        throw new Error("selection not found");
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      await page.click("input[id=name]");
      await page.type("input[id=name]", "test");

      await page.click("input[id=description]");
      await page.type("input[id=description]", "zoom");

      await page.click("input[id=startTime]");
      await page.type("input[id=startTime]", "2:30 PM");

      await page.click("input[id=startDate]");
      await page.type("input[id=startDate]", "3/30/21");

      await page.click("input[id=category]");
      await page.type("input[id=category]","sports");

      await page.click("input[id=image]");
      await page.type("input[id=image]", "https://cdn.fastly.picmonkey.com/content4/previews/social/social_73_550.png");

      await page.click("input[id=notify]");
      await page.type("input[id=notify]", "yes");

      await page.click("button[id=submit]");
  })

  test("landing page created successfully",async()=>{
    //await page.goto('http://localhost:3000/Meeting/landing/88668296172')
    await new Promise(resolve => setTimeout(resolve, 10000));

    await page.waitForSelector("#title");
    let title = await page.$eval('#title', element => element.innerHTML);

    await page.waitForSelector("#image");
    let image = await page.$eval('#image', element => element.src);

    expect(title).toBe("test :  0021-03-30");
    expect(image).toBe("https://cdn.fastly.picmonkey.com/content4/previews/social/social_73_550.png")
  })

  test("joined meeting successfully", async()=>{
    await page.waitForSelector("#click")
    page.click("#click");

    await new Promise(resolve=>(setTimeout(resolve,5000)))
    await page.waitForSelector("#zmmtg-root")
  })

  test("leave meeting successfully", async()=>{
    await page.waitForSelector(".footer__leave-btn");
    await page.click(".footer__leave-btn")

    await page.waitForSelector(".leave-meeting-options__btn")
    await page.click(".leave-meeting-options__btn")
    await new Promise(resolve=> setTimeout(resolve,4000))
  })

  test("logged out successfully",async()=>{
    const element_is_visible = await page.evaluate(() => {
      const element = document.querySelector('#LogOut');
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && !!(rect.bottom || rect.top || rect.height || rect.width);
    });
    if(element_is_visible){
      //await page.waitForSelector("#Main")
      await page.click("#LogOut");
      await page.waitForSelector(".logincontainer");
    }
  })
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
/*
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
  
  test("users can signout", async () => {
    await page.goto(routes.private.main);
    await page.waitForSelector(".root");
    await page.click(".LogOut");
    await page.waitForSelector(".loginPage");
  }, 1600000);
});

*/

afterAll(async ()=>{if(browser)await browser.close()});