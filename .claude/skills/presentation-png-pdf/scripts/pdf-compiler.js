const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class PDFCompiler {
  constructor() {
    this.pdfDoc = null;
  }

  /**
   * Compile PNG images into a single PDF
   * @param {Array} imagePaths - Paths to PNG images (in order)
   * @param {string} outputPath - Path to save PDF
   * @returns {Promise<string>} Path to created PDF
   */
  async compile(imagePaths, outputPath) {
    console.log(`\nCompiling ${imagePaths.length} images into PDF...`);

    // Create new PDF document
    this.pdfDoc = await PDFDocument.create();

    // Add each image as a page
    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      await this.addImagePage(imagePath, i + 1, imagePaths.length);
    }

    // Save PDF
    await this.save(outputPath);

    // Get file size
    const stats = await fs.stat(outputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`\n✓ PDF created: ${path.basename(outputPath)} (${sizeMB} MB)`);
    console.log(`  Location: ${outputPath}`);

    return outputPath;
  }

  /**
   * Add an image as a new page in the PDF
   * @param {string} imagePath - Path to PNG image
   * @param {number} pageNum - Page number for logging
   * @param {number} total - Total pages for logging
   */
  async addImagePage(imagePath, pageNum, total) {
    try {
      // Read image file
      const imageBytes = await fs.readFile(imagePath);

      // Embed PNG image
      const image = await this.pdfDoc.embedPng(imageBytes);

      // Get image dimensions
      const { width, height } = image.scale(1);

      // Create page with exact image dimensions (preserves full resolution)
      const page = this.pdfDoc.addPage([width, height]);

      // Draw image at full size
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: width,
        height: height
      });

      console.log(`  [${pageNum}/${total}] Added ${path.basename(imagePath)} (${width}x${height})`);
    } catch (error) {
      console.error(`Error adding image ${imagePath}:`, error.message);
      throw error;
    }
  }

  /**
   * Save PDF to file
   * @param {string} outputPath - Output file path
   */
  async save(outputPath) {
    try {
      // Ensure output directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      // Save PDF
      const pdfBytes = await this.pdfDoc.save();
      await fs.writeFile(outputPath, pdfBytes);
    } catch (error) {
      throw new Error(`Failed to save PDF: ${error.message}`);
    }
  }

  /**
   * Compile with metadata
   * @param {Array} imagePaths - Paths to PNG images
   * @param {string} outputPath - Output PDF path
   * @param {Object} metadata - PDF metadata (title, author, subject, keywords)
   * @returns {Promise<string>} Path to created PDF
   */
  async compileWithMetadata(imagePaths, outputPath, metadata = {}) {
    console.log(`\nCompiling ${imagePaths.length} images into PDF with metadata...`);

    // Create new PDF document
    this.pdfDoc = await PDFDocument.create();

    // Set metadata
    if (metadata.title) this.pdfDoc.setTitle(metadata.title);
    if (metadata.author) this.pdfDoc.setAuthor(metadata.author);
    if (metadata.subject) this.pdfDoc.setSubject(metadata.subject);
    if (metadata.keywords) this.pdfDoc.setKeywords(metadata.keywords);
    if (metadata.creator) this.pdfDoc.setCreator(metadata.creator || 'Claude Presentation Maker');
    this.pdfDoc.setProducer('pdf-lib');
    this.pdfDoc.setCreationDate(new Date());

    console.log(`  Metadata:`);
    if (metadata.title) console.log(`    Title: ${metadata.title}`);
    if (metadata.author) console.log(`    Author: ${metadata.author}`);

    // Add images
    for (let i = 0; i < imagePaths.length; i++) {
      await this.addImagePage(imagePaths[i], i + 1, imagePaths.length);
    }

    // Save
    await this.save(outputPath);

    const stats = await fs.stat(outputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`\n✓ PDF created: ${path.basename(outputPath)} (${sizeMB} MB)`);

    return outputPath;
  }

  /**
   * Create PDF with compression (smaller file size)
   * @param {Array} imagePaths - Paths to PNG images
   * @param {string} outputPath - Output PDF path
   * @returns {Promise<string>} Path to created PDF
   */
  async compileCompressed(imagePaths, outputPath) {
    console.log(`\nCompiling ${imagePaths.length} images into compressed PDF...`);

    this.pdfDoc = await PDFDocument.create();

    for (let i = 0; i < imagePaths.length; i++) {
      await this.addImagePage(imagePaths[i], i + 1, imagePaths.length);
    }

    // Save with compression options
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    const pdfBytes = await this.pdfDoc.save({
      useObjectStreams: true, // Enable compression
      addDefaultPage: false
    });
    await fs.writeFile(outputPath, pdfBytes);

    const stats = await fs.stat(outputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`\n✓ Compressed PDF created: ${path.basename(outputPath)} (${sizeMB} MB)`);

    return outputPath;
  }

  /**
   * Validate images before compilation
   * @param {Array} imagePaths - Paths to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateImages(imagePaths) {
    const errors = [];
    const warnings = [];

    for (const imagePath of imagePaths) {
      try {
        // Check if file exists
        await fs.access(imagePath);

        // Check if file is a PNG
        if (!imagePath.toLowerCase().endsWith('.png')) {
          warnings.push(`File is not PNG: ${imagePath}`);
        }

        // Check file size
        const stats = await fs.stat(imagePath);
        const sizeMB = stats.size / (1024 * 1024);

        if (sizeMB > 20) {
          warnings.push(`Large file (${sizeMB.toFixed(1)} MB): ${path.basename(imagePath)}`);
        }
      } catch (error) {
        errors.push(`File not found or inaccessible: ${imagePath}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get estimated PDF size
   * @param {Array} imagePaths - Paths to images
   * @returns {Promise<string>} Estimated size
   */
  async estimateSize(imagePaths) {
    let totalBytes = 0;

    for (const imagePath of imagePaths) {
      try {
        const stats = await fs.stat(imagePath);
        totalBytes += stats.size;
      } catch (error) {
        // Skip missing files
      }
    }

    const sizeMB = (totalBytes / (1024 * 1024)).toFixed(2);
    return `~${sizeMB} MB`;
  }
}

module.exports = PDFCompiler;
