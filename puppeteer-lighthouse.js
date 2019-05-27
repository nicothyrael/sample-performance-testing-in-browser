'use strict';

const website = 'https://kraken-qa-26.sofitest.com';
const puppeteer = require('puppeteer');
const perfConfig = require('./config.performance.js');
const fs = require('fs');
const resultsDir = 'results';
const { gatherLighthouseMetrics } = require('./helpers');
var uniqueId = Math.random().toString(36).substring(2) 
               + (new Date()).getTime().toString(36);

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
  
  await page.type('#basicInfo_firstName', 'Nancy');
  await page.type('#basicInfo_lastName', 'Brikhead');
  await page.type('#reg-form > div:nth-child(4) > label', 'Pennsylvania');
  await page.type('#email', 'nancy+'+ uniqueId +'@sofitest.com');
  await page.type('#password1', 'password1');
  await page.type('#password2', 'password1');
  await page.click('#consents')
  await Promise.all([
    page.waitForNavigation(),
    page.click('#register-btn'),
  ]);
  //await verify(page, 'registered_user_page');


  await page.type('[data-qa="amount-requested-currency-input"]', '20000');
  await Promise.all([
    page.waitForNavigation(),
    page.click('[data-qa="pl-use-id-13"]')
  ]);
  
  await page.type('[data-qa="date-of-birth"]', '10141963');
  await Promise.all([
    page.waitForNavigation(),
    page.click('[data-qa="citizenship-citizen"]')
  ]);
  
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