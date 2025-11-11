#!/usr/bin/env node

const path = require('path');
const fs = require('fs').promises;
const ContentParser = require('../utils/content-parser');
const StyleGuideDiscovery = require('../utils/style-guide-discovery');
const HTMLGenerator = require('./html-generator');
const ScreenshotGenerator = require('./screenshot-generator');
const PDFCompiler = require('./pdf-compiler');
const OpenRouterClient = require('./openrouter-client');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class PresentationCreator {
  constructor() {
    this.outputDir = process.env.OUTPUT_DIR || '/Users/terrancebrandon/Desktop/AI Presentations';
    this.parser = new ContentParser();
    this.styleDiscovery = new StyleGuideDiscovery();
    this.openrouter = new OpenRouterClient();
    this.selectedStyle = null;
    this.presentationName = null;
    this.slides = [];
  }

  /**
   * Main workflow
   */
  async create() {
    console.log('\n🎨 Presentation PNG/PDF Creator\n');
    console.log('='.repeat(50));

    try {
      // Step 1: Discover style guides
      await this.discoverStyles();

      // Step 2: Get presentation content
      await this.getContent();

      // Step 3: Select style guide
      await this.selectStyle();

      // Step 4: Parse content into slides
      await this.parseContent();

      // Step 5: Generate images (if needed)
      await this.generateImages();

      // Step 6: Generate HTML slides
      await this.generateHTML();

      // Step 7: Capture screenshots
      await this.captureScreenshots();

      // Step 8: Compile PDF
      await this.compilePDF();

      // Step 9: Cleanup and summary
      await this.complete();
    } catch (error) {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Discover available style guides
   */
  async discoverStyles() {
    console.log('\n📚 Discovering style guides...\n');

    const guides = await this.styleDiscovery.discoverAll();
    console.log(this.styleDiscovery.formatMenu(guides));

    console.log(`Found ${guides.length} style guide${guides.length !== 1 ? 's' : ''}`);
  }

  /**
   * Get presentation content from user
   * This is called by Claude with the content
   */
  async getContent() {
    // This method will be called by Claude with content
    // For now, we'll just note that it's ready
    console.log('\n📝 Ready to receive presentation content');
  }

  /**
   * Select a style guide
   * This is called by Claude with the selection number
   */
  async selectStyle() {
    console.log('\n🎨 Ready to select style guide');
  }

  /**
   * Parse content into structured slides
   */
  async parseContent() {
    console.log('\n🔍 Parsing content into slides...');

    // Validate parsed slides
    const validation = this.parser.validate(this.slides);

    if (!validation.valid) {
      throw new Error(`Content validation failed: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      validation.warnings.forEach(w => console.log(`  - ${w}`));
    }

    console.log(`\n✓ Parsed ${validation.slideCount} slides`);
  }

  /**
   * Generate images using OpenRouter
   */
  async generateImages() {
    const slidesNeedingImages = this.slides.filter(s => s.needsImage);

    if (slidesNeedingImages.length === 0) {
      console.log('\n🖼️  No images needed (using SVG graphics only)');
      return;
    }

    console.log(`\n🖼️  Generating ${slidesNeedingImages.length} images...`);

    const imageDir = path.join(this.workDir, 'images');
    await fs.mkdir(imageDir, { recursive: true });

    for (const slide of slidesNeedingImages) {
      try {
        const prompt = this.openrouter.generateImagePrompt(slide) ||
          `Professional business presentation image for: ${slide.title}`;

        const imagePath = path.join(imageDir, `slide-${slide.number}-image.png`);

        await this.openrouter.generateAndDownload(prompt, imagePath, {
          slideType: slide.type,
          position: 'full'
        });

        // Store image path in slide
        if (slide.type === 'title' || slide.type === 'hero') {
          slide.heroImagePath = imagePath;
        } else {
          slide.imagePath = imagePath;
        }
      } catch (error) {
        console.warn(`  ⚠️  Failed to generate image for slide ${slide.number}: ${error.message}`);
      }
    }
  }

  /**
   * Generate HTML slides
   */
  async generateHTML() {
    console.log('\n📄 Generating HTML slides...');

    const htmlDir = path.join(this.workDir, 'html');
    const htmlGenerator = new HTMLGenerator(this.selectedStyle);

    this.htmlPaths = await htmlGenerator.generateAll(this.slides, htmlDir);

    console.log(`\n✓ Generated ${this.htmlPaths.length} HTML files`);
  }

  /**
   * Capture screenshots
   */
  async captureScreenshots() {
    const screenshotDir = path.join(this.presentationDir, 'slides');
    const screenshotGen = new ScreenshotGenerator({
      scale: parseInt(process.env.SCREENSHOT_SCALE) || 2
    });

    try {
      this.screenshotPaths = await screenshotGen.generateAll(
        this.htmlPaths,
        screenshotDir,
        this.presentationName
      );

      console.log(`\n✓ Generated ${this.screenshotPaths.length} high-resolution PNGs`);
      console.log(`  Resolution: 3840x2160 (2x scale)`);
      console.log(`  Location: ${screenshotDir}`);
    } finally {
      await screenshotGen.close();
    }
  }

  /**
   * Compile PDF from screenshots
   */
  async compilePDF() {
    const pdfPath = path.join(this.presentationDir, `${this.presentationName}.pdf`);
    const pdfCompiler = new PDFCompiler();

    // Validate images first
    const validation = await pdfCompiler.validateImages(this.screenshotPaths);

    if (!validation.valid) {
      console.warn('\n⚠️  Image validation warnings:');
      validation.errors.forEach(e => console.warn(`  - ${e}`));
    }

    if (validation.warnings.length > 0) {
      validation.warnings.forEach(w => console.log(`  ℹ️  ${w}`));
    }

    // Compile with metadata
    await pdfCompiler.compileWithMetadata(this.screenshotPaths, pdfPath, {
      title: this.presentationName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      author: 'Created with Claude Presentation Maker',
      subject: 'Business Presentation',
      creator: 'Claude Presentation PNG/PDF Skill'
    });

    this.pdfPath = pdfPath;
  }

  /**
   * Complete and cleanup
   */
  async complete() {
    console.log('\n' + '='.repeat(50));
    console.log('✅ Presentation created successfully!');
    console.log('='.repeat(50));

    console.log(`\n📁 Output Directory: ${this.presentationDir}`);
    console.log(`\n📊 Summary:`);
    console.log(`  - Slides: ${this.slides.length}`);
    console.log(`  - PNGs: ${this.screenshotPaths.length} files (3840x2160)`);
    console.log(`  - PDF: ${path.basename(this.pdfPath)}`);

    if (this.selectedStyle && this.selectedStyle.id !== 'ai-led') {
      console.log(`  - Style: ${this.selectedStyle.name}`);
    } else {
      console.log(`  - Style: AI-led (custom)`);
    }

    console.log(`\n📂 Files:`);
    console.log(`  PDF: ${this.pdfPath}`);
    console.log(`  PNGs: ${path.join(this.presentationDir, 'slides/')}`);

    // Cleanup temp files
    await this.cleanup();
  }

  /**
   * Cleanup temporary files
   */
  async cleanup() {
    try {
      // Remove HTML temp directory
      const htmlDir = path.join(this.workDir, 'html');
      await fs.rm(htmlDir, { recursive: true, force: true });

      // Remove temp work directory if no images were generated
      const imageDir = path.join(this.workDir, 'images');
      try {
        const images = await fs.readdir(imageDir);
        if (images.length === 0) {
          await fs.rm(this.workDir, { recursive: true, force: true });
        }
      } catch (e) {
        // No images directory, safe to remove work dir
        await fs.rm(this.workDir, { recursive: true, force: true });
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  /**
   * Set presentation content (called by Claude)
   * @param {string} content - Presentation content
   * @param {string} format - Content format (markdown, outline, text, json)
   */
  setContent(content, format = 'auto') {
    this.slides = this.parser.parse(content, format);
  }

  /**
   * Set style guide by selection number (called by Claude)
   * @param {number} selection - Style guide selection (1-based index)
   */
  async setStyleBySelection(selection) {
    const styleGuide = this.styleDiscovery.getBySelection(selection);

    if (!styleGuide) {
      throw new Error(`Invalid style selection: ${selection}`);
    }

    this.selectedStyle = await this.styleDiscovery.loadStyleGuide(styleGuide);
    console.log(`\n✓ Selected style: ${this.selectedStyle.name}`);
  }

  /**
   * Set presentation name (called by Claude)
   * @param {string} name - Presentation name
   */
  setPresentationName(name) {
    // Sanitize name for filesystem
    this.presentationName = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Create presentation directory
    const timestamp = new Date().toISOString().split('T')[0];
    this.presentationDir = path.join(this.outputDir, `${this.presentationName}-${timestamp}`);

    // Create work directory (for temp files)
    this.workDir = path.join(this.presentationDir, '.work');
  }
}

// Export for use in Claude skill
module.exports = PresentationCreator;

// Allow running directly
if (require.main === module) {
  const creator = new PresentationCreator();
  creator.create().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
