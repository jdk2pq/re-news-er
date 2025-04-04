import dotenv from "dotenv";
import { FingerprintInjector } from "fingerprint-injector";
import { FingerprintGenerator } from "fingerprint-generator";
import { addExtra } from 'puppeteer-extra'
import puppeteerImport from 'puppeteer';
import { setTimeout } from "node:timers/promises";

const puppeteer = addExtra(puppeteerImport)
dotenv.config();

/**
 * Feel free to change these both to `true` to run in headless mode. However, you may be more likely
 * to get recognized as a bot and be blocked if you run this script headless, so watch out!
 */
const NYT_HEADLESS = false;
const WAPO_HEADLESS = true;

async function setupBrowser(headless: boolean)  {
  const browser = await puppeteer.launch({ headless, args: [
      '--disable-features=TrackingProtection3pcd'
    ] });
  const page = await browser.newPage();

  const generator = new FingerprintGenerator();
  const fingerprintWithHeaders = generator.getFingerprint({});

  const injector = new FingerprintInjector();
  await injector.attachFingerprintToPuppeteer(page, fingerprintWithHeaders);

  return { browser, page }
}

/**
 * Note: NYT bot detection seems to work fairly well, so you may occasionally get blocked by their
 * bot detection with this script. Changing your IP or waiting a day or so should get you unblocked.
 */
async function autoRenewNYT() {
  const { browser, page } = await setupBrowser(NYT_HEADLESS)

  const accounts = JSON.parse(process.env.NYT_ACCOUNTS!) as {
    user: string;
    pass: string;
  }[];

  await Promise.all(
    accounts.map(async ({ user, pass }) => {
      try {
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(
          "https://www.dclibrary.org/research-and-learn/new-york-times-digital",
          {
            waitUntil: "domcontentloaded",
            timeout: 30000,
          },
        );
        const elementHandle = await page.locator('.resource__link.container a').waitHandle()
        const href = await (await elementHandle.getProperty('href')).jsonValue()
        const [ match, campaignId, giftCode ] = href.match(/[?&]campaignId=([^&]+).*?[?&]gift_code=([^&]+)/) as string[]
        await page.goto(
          `https://myaccount.nytimes.com/auth/login?response_type=cookie&client_id=gftrdm&display=gift&redirect_uri=https%3A%2F%2Fwww.nytimes.com%2Factivate-access%2Faccess-code%3Faccess_code%3D${giftCode}%26source%3Daccess_code_redemption_lp%3Anews%26campaignId%3D${campaignId}`,
          {
            waitUntil: "domcontentloaded",
            timeout: 30000,
          },
        );
        await page.mouse.move(40, 160);
        await setTimeout(3000);
        await page.type("#email", user, { delay: 105 });
        await page.locator('[data-testid="submit-email"]').click();
        await setTimeout(3000);
        await page.mouse.move(-40, -160);
        await page.type("#password", pass, { delay: 120 });
        await setTimeout(3000);
        await page.mouse.move(70, 150);
        await page.locator('[data-testid="login-button"]').click();
        await setTimeout(3000);
        await page.locator('[data-testid="get-started-btn"]').click();
        console.log(`Successfully renewed your NYT subscription for ${user}`);
      } catch (e) {
        console.error(`Error renewing the NYT subscription for ${user}: ${e}`);
        return Promise.reject(e);
      }
    }),
  );
  await browser.close();
}

async function autoRenewWaPo() {
  const { browser, page } = await setupBrowser(WAPO_HEADLESS)

  const accounts = JSON.parse(process.env.WAPO_ACCOUNTS!) as {
    user: string;
    pass: string;
  }[];

  await Promise.all(
    accounts.map(async ({ user, pass }) => {
      try {
        await page.goto("https://www.washingtonpost.com/subscribe/signin/");
        await setTimeout(3000);
        await page.mouse.move(40, 160);
        await page.type("#username", user, { delay: 112 });
        await setTimeout(1600);
        await page.mouse.move(-40, -160);
        await page.locator('[data-test-id="sign-in-btn"]').click();
        await setTimeout(2300);
        await page.type("#password", pass, { delay: 114 });
        await setTimeout(1200);
        await page.mouse.move(70, 150);
        await page.locator('[data-test-id="sign-in-btn"]').click();
        await setTimeout(3000);
        await page.goto(
          "https://www.washingtonpost.com/subscribe/signin/special-offers?s_oe=SPECIALOFFER_DCPUBLICLIBRARY",
        );
        await setTimeout(5000);
        console.log(
          `Successfully renewed your Washington Post subscription for ${user}`,
        );
      } catch (e) {
        console.error(
          `Error renewing the Washington Post subscription for ${user}: ${e}`,
        );
        return Promise.reject(e);
      }
    }),
  );
  await browser.close();
}

async function renewAccounts() {
  if (!process.env.NYT_ACCOUNTS && !process.env.WAPO_ACCOUNTS) {
    console.error('ERROR: No accounts configured in your .env file! Exiting...\n')
    process.exit(1);
  }
  if (process.env.NYT_ACCOUNTS) {
    await autoRenewNYT();
  }
  if (process.env.WAPO_ACCOUNTS) {
    await autoRenewWaPo();
  }
  process.exit();
}

renewAccounts();
