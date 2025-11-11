const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class ScreenshotGenerator {
  constructor(options = {}) {
    this.width = options.width || 1920;
    this.height = options.height || 1080;
    this.scale = options.scale || 2; // 2x for high resolution (3840x2160)
    this.delay = options.delay || 2000; // Wait time for fonts/images to load
    this.browser = null;
  }

  /**
   * Initialize Puppeteer browser
   */
  async init() {
    if (this.browser) return;

    console.log('Launching browser...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--font-render-hinting=none'
      ]
    });
    console.log('Browser launched successfully');
  }

  /**
   * Close browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('Browser closed');
    }
  }

  /**
   * Generate screenshots for all HTML files
   * @param {Array} htmlPaths - Paths to HTML files
   * @param {string} outputDir - Output directory for screenshots
   * @param {string} presentationName - Name of presentation (for filenames)
   * @returns {Promise<Array>} Array of screenshot file paths
   */
  async generateAll(htmlPaths, outputDir, presentationName = 'presentation') {
    await this.init();
    await fs.mkdir(outputDir, { recursive: true });

    const screenshotPaths = [];

    console.log(`\nGenerating ${htmlPaths.length} screenshots at ${this.width}x${this.height} @ ${this.scale}x scale...`);

    for (let i = 0; i < htmlPaths.length; i++) {
      const htmlPath = htmlPaths[i];
      const slideNumber = String(i + 1).padStart(2, '0');
      const filename = `${presentationName}-slide-${slideNumber}.png`;
      const outputPath = path.join(outputDir, filename);

      await this.captureScreenshot(htmlPath, outputPath, i + 1, htmlPaths.length);
      screenshotPaths.push(outputPath);
    }

    return screenshotPaths;
  }

  /**
   * Capture a screenshot of a single HTML file
   * @param {string} htmlPath - Path to HTML file
   * @param {string} outputPath - Path to save screenshot
   * @param {number} slideNum - Slide number for logging
   * @param {number} total - Total slides for logging
   */
  async captureScreenshot(htmlPath, outputPath, slideNum, total) {
    const page = await this.browser.newPage();

    try {
      // Set viewport with device scale factor for high-res output
      await page.setViewport({
        width: this.width,
        height: this.height,
        deviceScaleFactor: this.scale
      });

      // Navigate to HTML file
      const fileUrl = `file://${path.resolve(htmlPath)}`;
      await page.goto(fileUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait for fonts and images to load
      await new Promise(resolve => setTimeout(resolve, this.delay));

      // Additional wait for web fonts
      await page.evaluate(() => {
        return document.fonts.ready;
      });

      // Take screenshot
      await page.screenshot({
        path: outputPath,
        type: 'png',
        fullPage: false
      });

      // Get actual dimensions of screenshot
      const stats = await fs.stat(outputPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log(`  [${slideNum}/${total}] ${path.basename(outputPath)} (${sizeMB} MB)`);
    } catch (error) {
      console.error(`Error capturing screenshot for ${htmlPath}:`, error.message);
      throw error;
    } finally {
      await page.close();
    }
  }

  /**
   * Capture a screenshot with custom viewport
   * @param {string} htmlPath - Path to HTML file
   * @param {string} outputPath - Output path
   * @param {Object} viewport - Custom viewport settings
   */
  async captureWithViewport(htmlPath, outputPath, viewport) {
    await this.init();
    const page = await this.browser.newPage();

    try {
      await page.setViewport({
        width: viewport.width || this.width,
        height: viewport.height || this.height,
        deviceScaleFactor: viewport.scale || this.scale
      });

      const fileUrl = `file://${path.resolve(htmlPath)}`;
      await page.goto(fileUrl, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, this.delay));
      await page.evaluate(() => document.fonts.ready);

      await page.screenshot({
        path: outputPath,
        type: 'png',
        fullPage: false
      });

      console.log(`Screenshot saved: ${outputPath}`);
    } finally {
      await page.close();
    }
  }

  /**
   * Optimize screenshot settings for different use cases
   * @param {string} preset - Preset name (screen, print, web)
   */
  setPreset(preset) {
    const presets = {
      screen: { width: 1920, height: 1080, scale: 2 },  // 3840x2160
      print: { width: 1920, height: 1080, scale: 4 },   // 7680x4320 (ultra high-res)
      web: { width: 1920, height: 1080, scale: 1 },     // 1920x1080 (standard)
      thumbnail: { width: 1920, height: 1080, scale: 0.5 } // 960x540 (small)
    };

    const settings = presets[preset] || presets.screen;
    this.width = settings.width;
    this.height = settings.height;
    this.scale = settings.scale;

    console.log(`Preset applied: ${preset} (${this.width}x${this.height} @ ${this.scale}x)`);
  }

  /**
   * Get estimated total size of screenshots
   * @param {number} slideCount - Number of slides
   * @returns {string} Estimated size in MB
   */
  estimateSize(slideCount) {
    // Rough estimate: 2x PNG ~= 2-3 MB per slide
    const avgSizeMB = this.scale === 2 ? 2.5 : this.scale === 4 ? 8 : 1;
    const totalMB = (slideCount * avgSizeMB).toFixed(1);
    return `~${totalMB} MB`;
  }
}

module.exports = ScreenshotGenerator;
