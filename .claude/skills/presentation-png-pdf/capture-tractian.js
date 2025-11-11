#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const ScreenshotGenerator = require('./scripts/screenshot-generator');
const PDFCompiler = require('./scripts/pdf-compiler');

async function capturePresentation() {
  console.log('📸 Converting TRACTIAN Presentation to PNG/PDF...\n');

  // Define paths
  const presentationDir = '/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker/tractian-presentation';
  const outputDir = '/Users/terrancebrandon/Desktop/AI Presentations/TRACTIAN-Competitive-Intelligence-2025-11-11';
  const slidesDir = path.join(outputDir, 'slides');

  // Create output directories
  [outputDir, slidesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Find all slide HTML files
  const slideFiles = fs.readdirSync(presentationDir)
    .filter(file => file.match(/^slide-\d+\.html$/))
    .sort();

  console.log(`📁 Input:  ${presentationDir}`);
  console.log(`📁 Output: ${outputDir}`);
  console.log(`📄 Found ${slideFiles.length} slides\n`);

  // Initialize screenshot generator with 2x resolution
  const screenshotGen = new ScreenshotGenerator({
    scale: 2, // 3840x2160
    delay: 2000
  });

  try {
    await screenshotGen.init();

    const pngPaths = [];
    const totalSlides = slideFiles.length;

    // Capture each slide
    for (let i = 0; i < slideFiles.length; i++) {
      const file = slideFiles[i];
      const slideNumber = i + 1;

      console.log(`📸 [${slideNumber}/${totalSlides}] Capturing ${file}...`);

      const htmlPath = path.join(presentationDir, file);
      const pngPath = path.join(slidesDir, `TRACTIAN-slide-${String(slideNumber).padStart(2, '0')}.png`);

      // Check if HTML file exists
      if (!fs.existsSync(htmlPath)) {
        console.error(`   ❌ File not found: ${htmlPath}`);
        continue;
      }

      // Generate screenshot
      await screenshotGen.captureScreenshot(htmlPath, pngPath, slideNumber, totalSlides);
      pngPaths.push(pngPath);

      console.log(`   ✅ Saved to ${path.basename(pngPath)}`);
    }

    await screenshotGen.close();

    console.log(`\n✨ All ${pngPaths.length} slides captured!\n`);

    // Compile PDF
    console.log('📄 Compiling PDF...');
    const pdfCompiler = new PDFCompiler();
    const pdfPath = path.join(outputDir, 'TRACTIAN-Competitive-Intelligence.pdf');

    await pdfCompiler.compile(pngPaths, pdfPath);

    console.log(`   ✅ PDF saved to ${path.basename(pdfPath)}\n`);

    console.log('🎉 COMPLETE!\n');
    console.log('📦 Deliverables:');
    console.log(`   📄 PDF: ${pdfPath}`);
    console.log(`   🖼️  Slides: ${slidesDir}`);
    console.log(`   💾 HTML: ${presentationDir}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

capturePresentation().catch(console.error);
