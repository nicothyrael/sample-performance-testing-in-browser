'use strict';

const website = 'https://kraken-qa-26.sofitest.com';
const puppeteer = require('puppeteer');
const perfConfig = require('./config.performance.js');
const fs = require('fs');
const resultsDir = 'results';
const { gatherLighthouseMetrics } = require('./helpers');
var uniqueId = Math.random().toString(15).substring(2) 
               + (new Date()).getTime().toString(15);

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // slowMo: 250
  });
  const page = await browser.newPage();

  //await page.goto(website, {waitUntil: 'networkidle0'});
  //await verify(page, 'home_page');

  await page.goto(website + '/b/registration?appType=pl', {waitUntil: 'networkidle0'});
  //await verify(page, 'registration_page');
  
  await page.waitForFunction('document.querySelector("[data-qa=reg-firstName]")');
  await page.type('[data-qa=reg-firstName]', 'NANCY');
  await page.type('[data-qa=reg-lastName]', 'BIRKHEAD');
  await page.type('[data-qa=reg-state]', 'Pennsylvania');
  await page.type('[data-qa=reg-email]', 'nancy+'+ uniqueId +'@sofitest.com');
  await page.type('[data-qa=reg-pwd]', 'password1');
  await page.type('[data-qa=reg-confirmPwd]', 'password1');
  await page.click('[data-qa=reg-consents]');
  await page.click('[data-qa=reg-submit]');
  
  //await verify(page, 'registered_user_page');

  await page.waitForFunction('document.querySelector("[data-qa=amount-requested-currency-input]")');
  await page.type('[data-qa="amount-requested-currency-input"]', '20000');
  await page.click('[data-qa="pl-use-id-13"]');
  
  await page.waitForFunction('document.querySelector("[data-qa=date-of-birth]")');
  await page.type('[data-qa="date-of-birth"]', '10141963');
  await page.click('[data-qa="citizenship-citizen"]');
  
  await page.waitForFunction('document.querySelector("[data-qa=address-prediction]")');
  await page.type('[data-qa="address-prediction"]', '378 EAST ST');
  await page.waitFor(1000);
  await page.click('[data-qa="phoneNumber"]');
  await page.type('[data-qa="city"]', 'Bloomsburg');
  await page.type('[data-qa="state"]', 'Pennsylvania');
  await page.type('[data-qa="zip"]', '17815-1847');
  await page.type('[data-qa="phoneNumber"]', '5555555555');
  await page.click('[data-qa="next-button"]');

  await page.waitForFunction('document.querySelector("[data-qa=current-living-arrangement-own]")');
  await page.click('[data-qa="current-living-arrangement-own"]');

  await page.waitForFunction('document.querySelector("[data-qa=total-annual-income]")');
  await page.type('[data-qa="total-annual-income"]', '200000');
  await page.click('[data-qa="next-button"]');

  await page.waitForFunction('document.querySelector("[data-qa=apply-on-my-own]")');
  await page.click('[data-qa="apply-on-my-own"]');

  await page.waitForFunction('document.querySelector("[data-qa=check-my-rate-submit]")');
  await page.click('[data-qa="check-my-rate-submit"]');

  await page.waitForFunction('document.querySelector("[data-qa=continue-product-select]")');
  await page.evaluate(() => { 
    var radio = document.querySelector("input[type=radio]")
    radio[3].checked = true;
  }) 
  //await page.click('[data-qa="check-my-rate-submit"]');

  //await browser.close();
})();

async function verify(page, pageName) {
  await createDir(resultsDir);
  //await page.screenshot({ path: `./${resultsDir}/${pageName}.png`, fullPage: true });
  const metrics = await gatherLighthouseMetrics(page, perfConfig);
  fs.writeFileSync(`./${resultsDir}/${pageName}.json`, JSON.stringify(metrics, null, 2));
  return metrics;
}

async function createDir(dirName) {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, '0766');
  }
}