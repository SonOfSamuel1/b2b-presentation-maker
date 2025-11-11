#!/usr/bin/env node

/**
 * Church Presentation Image Downloader
 * Purpose: Automates searching and downloading high-quality church images from Unsplash/Pexels
 * Created: 2025-11-10
 *
 * Prerequisites:
 * - Node.js installed
 * - Playwright installed: npm install playwright
 *
 * Usage:
 * node download-church-images.js
 *
 * Authentication:
 * No login required - uses free public access to Unsplash and Pexels
 * Human-in-the-loop: Script will pause to let you select and download each image
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  headless: false,
  timeout: 30000,
  downloadTimeout: 60000,
  screenshotOnError: true,
  outputDir: '/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker/12stone-church-presentation/images',
  screenshotDir: '/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker/screenshots'
};

// Image search configuration
const IMAGE_SEARCHES = [
  {
    name: 'Church Building Exterior',
    searchQuery: 'modern church building exterior',
    fileName: 'church-exterior.jpg',
    dimensions: '600x600px (square) or larger',
    style: 'Professional, welcoming, contemporary church architecture',
    priority: 1
  },
  {
    name: 'Worship Service',
    searchQuery: 'church worship service congregation',
    fileName: 'worship-service.jpg',
    dimensions: '520x380px (landscape) or larger',
    style: 'Wide shot showing engaged congregation, raised hands',
    priority: 1
  },
  {
    name: 'Small Group Bible Study',
    searchQuery: 'small group bible study diverse',
    fileName: 'ministry-discipleship.jpg',
    dimensions: '240px height minimum',
    style: '4-8 people in intimate discussion with Bibles',
    priority: 1
  },
  {
    name: 'Kids Church Ministry',
    searchQuery: 'children church ministry kids',
    fileName: 'ministry-kids.jpg',
    dimensions: '240px height minimum',
    style: 'Elementary age kids engaged in church activities',
    priority: 1
  },
  {
    name: 'Leadership Training',
    searchQuery: 'leadership training seminar professional',
    fileName: 'ministry-leadership.jpg',
    dimensions: '240px height minimum',
    style: 'Adults in professional development setting',
    priority: 1
  },
  {
    name: 'Community Service/Outreach',
    searchQuery: 'community service volunteers helping',
    fileName: 'community-outreach.jpg',
    dimensions: '280px height minimum',
    style: 'Volunteers serving community (food distribution, etc.)',
    priority: 1
  },
  {
    name: 'Mission Trip/Global Missions',
    searchQuery: 'mission trip africa building school',
    alternateQuery: 'international mission work',
    fileName: 'global-missions.jpg',
    dimensions: '280px height minimum',
    style: 'Construction/development work in international setting',
    priority: 1
  },
  {
    name: 'Church Growth/Large Congregation',
    searchQuery: 'large church crowd worship',
    alternateQuery: 'packed church service',
    fileName: 'church-growth-2011.jpg',
    dimensions: '200px height minimum',
    style: 'Shows scale of large attendance',
    priority: 1
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Pause execution and wait for user to complete image selection
 */
async function pauseForImageSelection(page, imageInfo) {
  console.log('\n' + '='.repeat(70));
  console.log('IMAGE SELECTION REQUIRED');
  console.log('='.repeat(70));
  console.log(`Image: ${imageInfo.name}`);
  console.log(`Search Query: "${imageInfo.searchQuery}"`);
  console.log(`Required Dimensions: ${imageInfo.dimensions}`);
  console.log(`Style: ${imageInfo.style}`);
  console.log(`Save As: ${imageInfo.fileName}`);
  console.log('\nCurrent URL:', page.url());
  console.log('\nINSTRUCTIONS:');
  console.log('1. Review the search results on the page');
  console.log('2. Click on your preferred image');
  console.log('3. Download the high-resolution version');
  console.log(`4. Save it as: ${imageInfo.fileName}`);
  console.log(`5. Move it to: ${CONFIG.outputDir}`);
  console.log('\nPress ENTER when you have completed the download...');
  console.log('='.repeat(70) + '\n');

  await new Promise(resolve => {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const onData = (key) => {
      // Check for Enter key (both \n and \r)
      if (key === '\n' || key === '\r' || key === '\u000D' || key === '\u000A') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        resolve();
      }
      // Check for Ctrl+C
      if (key === '\u0003') {
        process.exit();
      }
    };

    stdin.on('data', onData);
  });

  console.log('Continuing to next image...\n');
}

/**
 * Verify image was downloaded successfully
 */
async function verifyImageDownload(fileName) {
  const filePath = path.join(CONFIG.outputDir, fileName);
  try {
    const stats = await fs.stat(filePath);
    if (stats.size > 0) {
      console.log(`  Downloaded: ${fileName} (${(stats.size / 1024).toFixed(2)} KB)`);
      return true;
    }
  } catch (error) {
    console.log(`  WARNING: Could not verify ${fileName} - please check manually`);
    return false;
  }
  return false;
}

/**
 * Capture screenshot for documentation
 */
async function captureScreenshot(page, name) {
  try {
    await fs.mkdir(CONFIG.screenshotDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(CONFIG.screenshotDir, `${name}-${timestamp}.png`);
    await page.screenshot({ path: filename, fullPage: false });
    console.log(`  Screenshot saved: ${filename}`);
    return filename;
  } catch (e) {
    console.log('  Warning: Could not capture screenshot:', e.message);
    return null;
  }
}

/**
 * Search for an image on Unsplash
 */
async function searchUnsplash(page, searchQuery) {
  console.log(`  Searching Unsplash for: "${searchQuery}"`);

  try {
    // Navigate to Unsplash
    await page.goto('https://unsplash.com', { waitUntil: 'domcontentloaded', timeout: CONFIG.timeout });

    // Wait a moment for the page to load
    await page.waitForTimeout(2000);

    // Find and fill the search box
    const searchSelectors = [
      'input[name="searchQuery"]',
      'input[type="search"]',
      'input[placeholder*="Search"]',
      '[data-test="search-form-input"]',
      '#search'
    ];

    let searchBox = null;
    for (const selector of searchSelectors) {
      try {
        searchBox = page.locator(selector).first();
        if (await searchBox.isVisible({ timeout: 2000 })) {
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!searchBox || !(await searchBox.isVisible({ timeout: 2000 }))) {
      throw new Error('Could not find search box on Unsplash');
    }

    // Type search query and submit
    await searchBox.fill(searchQuery);
    await page.keyboard.press('Enter');

    // Wait for results to load
    await page.waitForTimeout(3000);

    console.log('  Search results loaded successfully');
    return true;

  } catch (error) {
    console.log(`  Error searching Unsplash: ${error.message}`);
    return false;
  }
}

/**
 * Search for an image on Pexels
 */
async function searchPexels(page, searchQuery) {
  console.log(`  Searching Pexels for: "${searchQuery}"`);

  try {
    // Navigate to Pexels
    await page.goto('https://www.pexels.com', { waitUntil: 'domcontentloaded', timeout: CONFIG.timeout });

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Find and fill the search box
    const searchSelectors = [
      'input[type="search"]',
      'input[placeholder*="Search"]',
      '#search',
      '.search-input'
    ];

    let searchBox = null;
    for (const selector of searchSelectors) {
      try {
        searchBox = page.locator(selector).first();
        if (await searchBox.isVisible({ timeout: 2000 })) {
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!searchBox || !(await searchBox.isVisible({ timeout: 2000 }))) {
      throw new Error('Could not find search box on Pexels');
    }

    // Type search query and submit
    await searchBox.fill(searchQuery);
    await page.keyboard.press('Enter');

    // Wait for results to load
    await page.waitForTimeout(3000);

    console.log('  Search results loaded successfully');
    return true;

  } catch (error) {
    console.log(`  Error searching Pexels: ${error.message}`);
    return false;
  }
}

// ============================================================================
// MAIN AUTOMATION FUNCTION
// ============================================================================

async function downloadChurchImages() {
  let browser = null;
  let page = null;
  const downloadedImages = [];
  const failedImages = [];

  try {
    console.log('Starting Church Presentation Image Download Assistant\n');
    console.log('This script will help you find and download high-quality images from Unsplash and Pexels');
    console.log('You will review and download each image manually for quality control\n');

    // Create output directory
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    console.log(`Output directory ready: ${CONFIG.outputDir}\n`);

    // Launch browser
    console.log('Launching browser...');
    browser = await chromium.launch({
      headless: CONFIG.headless,
      args: ['--start-maximized'],
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      acceptDownloads: true
    });

    page = await context.newPage();
    console.log('Browser launched successfully\n');

    // Process each image search
    for (let i = 0; i < IMAGE_SEARCHES.length; i++) {
      const imageInfo = IMAGE_SEARCHES[i];
      const imageNum = i + 1;

      console.log('='.repeat(70));
      console.log(`IMAGE ${imageNum}/${IMAGE_SEARCHES.length}: ${imageInfo.name}`);
      console.log('='.repeat(70));

      try {
        // Try Unsplash first
        console.log('\nStep 1: Searching Unsplash (preferred source)...');
        const unsplashSuccess = await searchUnsplash(page, imageInfo.searchQuery);

        if (unsplashSuccess) {
          // Capture screenshot of search results
          await captureScreenshot(page, `unsplash-${imageInfo.fileName.replace('.jpg', '')}`);

          // Pause for manual selection and download
          await pauseForImageSelection(page, imageInfo);

          // Verify download
          const verified = await verifyImageDownload(imageInfo.fileName);
          if (verified) {
            downloadedImages.push({
              name: imageInfo.name,
              fileName: imageInfo.fileName,
              source: 'Unsplash',
              path: path.join(CONFIG.outputDir, imageInfo.fileName)
            });
            console.log(`SUCCESS: ${imageInfo.name} downloaded from Unsplash\n`);
            continue;
          } else {
            console.log('Image not found in output directory. Trying Pexels as backup...\n');
          }
        }

        // Try Pexels as backup
        console.log('Step 2: Searching Pexels (backup source)...');
        const pexelsSuccess = await searchPexels(page, imageInfo.searchQuery);

        if (pexelsSuccess) {
          // Capture screenshot of search results
          await captureScreenshot(page, `pexels-${imageInfo.fileName.replace('.jpg', '')}`);

          // Pause for manual selection and download
          await pauseForImageSelection(page, imageInfo);

          // Verify download
          const verified = await verifyImageDownload(imageInfo.fileName);
          if (verified) {
            downloadedImages.push({
              name: imageInfo.name,
              fileName: imageInfo.fileName,
              source: 'Pexels',
              path: path.join(CONFIG.outputDir, imageInfo.fileName)
            });
            console.log(`SUCCESS: ${imageInfo.name} downloaded from Pexels\n`);
          } else {
            console.log('WARNING: Image verification failed\n');
            failedImages.push({
              name: imageInfo.name,
              fileName: imageInfo.fileName,
              reason: 'Download not verified'
            });
          }
        } else {
          failedImages.push({
            name: imageInfo.name,
            fileName: imageInfo.fileName,
            reason: 'Search failed on both Unsplash and Pexels'
          });
        }

      } catch (error) {
        console.log(`ERROR processing ${imageInfo.name}: ${error.message}\n`);
        failedImages.push({
          name: imageInfo.name,
          fileName: imageInfo.fileName,
          reason: error.message
        });
      }

      // Brief pause between searches
      if (i < IMAGE_SEARCHES.length - 1) {
        console.log('Preparing next search...\n');
        await page.waitForTimeout(1000);
      }
    }

    // ========================================================================
    // FINAL REPORT
    // ========================================================================

    console.log('\n' + '='.repeat(70));
    console.log('DOWNLOAD COMPLETE - FINAL REPORT');
    console.log('='.repeat(70));

    console.log(`\nSuccessfully Downloaded: ${downloadedImages.length}/${IMAGE_SEARCHES.length}`);
    if (downloadedImages.length > 0) {
      console.log('\nDownloaded Images:');
      downloadedImages.forEach((img, idx) => {
        console.log(`  ${idx + 1}. ${img.name}`);
        console.log(`     File: ${img.fileName}`);
        console.log(`     Source: ${img.source}`);
        console.log(`     Path: ${img.path}`);
      });
    }

    if (failedImages.length > 0) {
      console.log(`\nFailed/Skipped: ${failedImages.length}`);
      console.log('\nImages That Need Manual Download:');
      failedImages.forEach((img, idx) => {
        console.log(`  ${idx + 1}. ${img.name} (${img.fileName})`);
        console.log(`     Reason: ${img.reason}`);
      });

      console.log('\nPlease manually download these images from:');
      console.log('  - https://unsplash.com');
      console.log('  - https://www.pexels.com');
    }

    console.log('\nOutput Directory:', CONFIG.outputDir);
    console.log('Screenshots Directory:', CONFIG.screenshotDir);
    console.log('\n' + '='.repeat(70));

    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      totalImages: IMAGE_SEARCHES.length,
      downloaded: downloadedImages.length,
      failed: failedImages.length,
      downloadedImages,
      failedImages,
      outputDirectory: CONFIG.outputDir
    };

    const reportPath = path.join(CONFIG.outputDir, 'download-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nDetailed report saved to: ${reportPath}`);

  } catch (error) {
    console.error('\nFATAL ERROR:', error.message);
    console.error('Stack trace:', error.stack);

    if (page && CONFIG.screenshotOnError) {
      await captureScreenshot(page, 'fatal-error');
    }

    throw error;

  } finally {
    // Cleanup
    if (browser) {
      await browser.close().catch(() => {});
      console.log('\nBrowser closed');
    }
  }
}

// ============================================================================
// EXECUTION
// ============================================================================

if (require.main === module) {
  console.log('\n');
  console.log('========================================================================');
  console.log('       CHURCH PRESENTATION IMAGE DOWNLOAD ASSISTANT');
  console.log('========================================================================');
  console.log('This script will help you download 8 high-quality images for your');
  console.log('church presentation from Unsplash and Pexels.');
  console.log('\nThe script will:');
  console.log('  1. Search for each image automatically');
  console.log('  2. Pause to let you review and select the best image');
  console.log('  3. Continue to the next image after you press ENTER');
  console.log('\nMake sure to download each image in high resolution (1920px+)');
  console.log('and save it with the correct filename in the images folder.');
  console.log('========================================================================\n');

  downloadChurchImages()
    .then(() => {
      console.log('\nAll done! Check the report above for details.');
      process.exit(0);
    })
    .catch(error => {
      console.error('\nScript failed:', error.message);
      process.exit(1);
    });
}

module.exports = { downloadChurchImages };
