const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");

async function scrapeFollowersOrFollowing(driver, type) {
  try {
    // Click on the followers or following link
    // let link = await driver.findElement(By.partialLinkText(type));
    // await link.click();

    let link = await driver.findElement(
      By.xpath(`//span[contains(text(), ${type})]`)
    );
    link.click();

    // Wait for the followers/following modal to appear
    await driver.wait(
      until.elementLocated(
        By.css(
          "div[style='display: flex; flex-direction: column; padding-bottom: 0px; padding-top: 0px; position: relative;']"
        )
      ),
      10000
    );

    let previousHeight;
    let usernames = new Set();

    while (true) {
      // Scroll to the bottom of the list
      previousHeight = await driver.executeScript(
        "return document.querySelector('div[role=\"dialog\"] ul').scrollHeight"
      );
      await driver.executeScript(
        "document.querySelector('div[role=\"dialog\"] ul').scrollTo(0, document.querySelector('div[role=\"dialog\"] ul').scrollHeight)"
      );
      await driver.sleep(1000); // Adjust sleep time as needed

      // Extract all visible usernames
      let userElements = await driver.findElements(
        By.css("div[role='dialog'] ul li")
      );
      for (let userElement of userElements) {
        let username = await userElement.findElement(By.css("a")).getText();
        usernames.add(username);
      }

      // Check if the scroll height didn't change (end of list)
      let newHeight = await driver.executeScript(
        "return document.querySelector('div[role=\"dialog\"] ul').scrollHeight"
      );
      if (newHeight === previousHeight) {
        break;
      }
      previousHeight = newHeight;
    }

    console.log(`${type} scraped:`, [...usernames]);
    return [...usernames]; // Convert Set to Array and return
  } catch (error) {
    console.error(`Error scraping ${type}:`, error);
  }
}

function dateTimeExtractor(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are 0-based
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the date and time
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return { formattedDate, formattedTime };
}

async function startAutomation() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://www.instagram.com");
    await driver.sleep(1000);

    let usernameInput = await driver.findElement(By.name("username"));
    let passwordInput = await driver.findElement(By.name("password"));
    let submitbtn = await driver.findElement(By.css("[type='submit']"));

    await usernameInput.sendKeys("suyog.scoe.comp@gmail.com");
    await passwordInput.sendKeys("Another#2003");
    await submitbtn.click();

    let profilePic = await driver.wait(
      until.elementLocated(By.css('img[alt*="profile picture"]')),
      10000
    );
    if (profilePic) {
      await profilePic.click();
      console.log("ProfilePic clicked");
    }

    let previousHeight = await driver.executeScript(
      "return document.body.scrollHeight"
    );

    while (true) {
      await driver.executeScript(
        "window.scrollTo(0, document.body.scrollHeight);"
      );
      await driver.sleep(1000);
      let newHeight = await driver.executeScript(
        "return document.body.scrollHeight"
      );
      if (newHeight === previousHeight) {
        break;
      }
      previousHeight = newHeight;
    }

    let postElements = await driver.findElements(
      By.css("div._ac7v.xras4av.xgc1b0m.xat24cr.xzboxd6 > div > a")
    );

    let postsData = [];

    for (let postElement of postElements) {
      try {
        await postElement.click();
        await driver.sleep(1000);

        await driver.wait(until.elementLocated(By.css("div._aagu")), 5000);

        let mediaElement = await driver.findElement(By.css("div._aagv img"));
        let mediaURL = await mediaElement.getAttribute("src");

        let firstCommentElement = await driver.findElement(
          By.css("ul._a9z6._a9za li")
        );
        let captionText = await firstCommentElement.getText();
        console.log("Post Caption:", captionText);

        let timeElement = await driver.findElement(By.css("time"));
        let timestamp = await timeElement.getAttribute("datetime");
        let date = new Date(timestamp);
        const { formattedDate, formattedTime } = dateTimeExtractor(date);

        postsData.push({
          mediaURL: mediaURL,
          caption: captionText,
          date: formattedDate,
          time: formattedTime,
        });

        await driver.findElement(By.css('svg[aria-label="Close"]')).click();
      } catch (error) {
        console.error("Error extracting data from a post:", error);
      }
    }

    let currentUrl = driver.getCurrentUrl();
    // currentUrl + "followers";
    await driver.get(`${currentUrl}/followers`);

    fs.writeFileSync(
      "instagram_posts.json",
      JSON.stringify(postsData, null, 2)
    );
    console.log("Post data saved to instagram_posts.json");
  } catch (err) {
    console.error(err);
  }
  // finally {
  //   await driver.quit();
  // }
}

startAutomation();
