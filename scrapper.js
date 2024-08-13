// const { Builder, By, Key, until } = require("selenium-webdriver");
// const fs = require("fs");

// function dateTimeExtractor(date) {
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1; // Months are 0-based
//   const day = date.getDate();
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const seconds = date.getSeconds();

//   // Format the date and time
//   const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
//     .toString()
//     .padStart(2, "0")}`;
//   const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
//     .toString()
//     .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

//   return { formattedDate, formattedTime };
// }

// async function startAutomation() {
//   let driver = await new Builder().forBrowser("chrome").build();
//   try {
//     await driver.get("http://www.instagram.com");
//     // setTimeout(3000);
//     await driver.sleep(1000);
//     let usernameInput = await driver.findElement(By.name("username"));

//     let passwordInput = await driver.findElement(By.name("password"));
//     let submitbtn = await driver.findElement(By.css("[type='submit']"));

//     await usernameInput.sendKeys("suyog.scoe.comp@gmail.com");
//     await passwordInput.sendKeys("Another#2003");
//     ~(await submitbtn.click());

//     let profilePic = await driver.wait(
//       until.elementLocated(By.css('img[alt*="profile picture"]')),
//       10000
//     );
//     if (profilePic) {
//       profilePic.click();
//       console.log("ProfilePic clicked");
//     }

//     let previousHeight = await driver.executeScript(
//       "return document.body.scrollHeight"
//     );

//     while (true) {
//       await driver.executeScript(
//         "window.scrollTo(0, document.body.scrollHeight);"
//       );
//       await driver.sleep(1000);
//       let newHeight = await driver.executeScript(
//         "return document.body.scrollHeight"
//       );
//       if (newHeight === previousHeight) {
//         break;
//       }
//       previousHeight = newHeight;
//     }

//     let postElements = await driver.findElements(
//       By.css("div._ac7v.xras4av.xgc1b0m.xat24cr.xzboxd6 > div > a")
//     );

//     // Prepare an array to store post data
//     let postsData = [];

//     // Loop through each post and extract required data
//     for (let postElement of postElements) {
//       try {
//         // Click on the post to open it
//         await postElement.click();
//         await driver.sleep(1000); // Adjust sleep time based on your connection speed

//         // Switch to the post modal
//         await driver.wait(until.elementLocated(By.css("div._aagu")), 5000);

//         // Extract post media (photo or video)
//         let mediaElement = await driver.findElement(By.css("div._aagv img"));
//         let mediaURL = await mediaElement.getAttribute("src");

//         // Extract post caption
//         // let captionElement = await driver.findElement(
//         //   By.css("div.C4VMK > span")
//         // );
//         // let captionText = await captionElement.getText();

//         let firstCommentElement = await driver.findElement(
//           By.css("ul._a9z6._a9za li")
//         );
//         let captionText = await firstCommentElement.getText();
//         console.log("Post Caption:", captionText);

//         // Extract post timestamp
//         let timeElement = await driver.findElement(By.css("time"));
//         let timestamp = await timeElement.getAttribute("datetime");
//         let date = new Date(timestamp);
//         const { d, t } = dateTimeExtractor(date);
//         // Extract post mentions
//         // let mentions = [];
//         // let mentionElements = await driver.findElements(By.css("a"));
//         // for (let mentionElement of mentionElements) {
//         //   let mentionText = await mentionElement.getText();
//         //   if (mentionText.startsWith("@")) {
//         //     mentions.push(mentionText);
//         //   }
//         // }

//         postsData.push({
//           mediaURL: mediaURL,
//           caption: captionText,
//           // timestamp: timestamp,
//           date: d,
//           time: t,

//           //   mentions: mentions,
//         });

//         await driver.findElement(By.css('svg[aria-label="Close"]')).click();
//       } catch (error) {
//         console.error("Error extracting data from a post:", error);
//         return driver.close();
//       }
//     }
//     console.log(postsData);
//     fs.writeFileSync(
//       "instagram_posts.json",
//       JSON.stringify(postsData, null, 1)
//     );
//     console.log("Post data saved to instagram_posts.json");
//   } catch (err) {
//     console.log(err);
//   } finally {
//     await driver.quit();
//   }
// }

// startAutomation();

const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");

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

    fs.writeFileSync(
      "instagram_posts.json",
      JSON.stringify(postsData, null, 2)
    );
    console.log("Post data saved to instagram_posts.json");
  } catch (err) {
    console.error(err);
  } finally {
    await driver.quit();
  }
}

startAutomation();
