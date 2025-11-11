#!/usr/bin/env node

const ScreenshotGenerator = require('./scripts/screenshot-generator');
const PDFCompiler = require('./scripts/pdf-compiler');
const fs = require('fs').promises;
const path = require('path');

async function main() {
  console.log('=== 12Stone Church Presentation Generator (Updated) ===\n');

  // Paths
  const presentationName = '12stone-church-updated';
  const inputDir = '/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker/12stone-church-presentation-v2';
  const outputBaseDir = '/Users/terrancebrandon/Desktop/AI Presentations';
  const timestamp = new Date().toISOString().split('T')[0];
  const outputDir = path.join(outputBaseDir, `${presentationName}-${timestamp}`);
  const slidesDir = path.join(outputDir, 'slides');

  // Create output directories
  await fs.mkdir(slidesDir, { recursive: true });

  // Get all HTML slide files
  const files = await fs.readdir(inputDir);
  const htmlFiles = files
    .filter(f => f.startsWith('slide-') && f.endsWith('.html'))
    .sort()
    .map(f => path.join(inputDir, f));

  console.log(`Found ${htmlFiles.length} slides to process\n`);

  // Generate screenshots
  console.log('Step 1: Generating high-resolution PNG screenshots...');
  const screenshotGen = new ScreenshotGenerator({
    width: 1920,
    height: 1080,
    scale: 2, // 2x for 3840x2160 resolution
    delay: 3000 // Increased delay to ensure SVG gradients render properly
  });

  const pngPaths = await screenshotGen.generateAll(htmlFiles, slidesDir, presentationName);
  await screenshotGen.close();

  console.log(`\n✓ Generated ${pngPaths.length} PNG slides\n`);

  // Compile PDF
  console.log('Step 2: Compiling slides into PDF...');
  const pdfPath = path.join(outputDir, `${presentationName}.pdf`);
  const pdfCompiler = new PDFCompiler();
  await pdfCompiler.compile(pngPaths, pdfPath);

  console.log(`\n✓ PDF compiled: ${pdfPath}\n`);

  // Copy PDF to project folder
  console.log('Step 3: Saving copy to project folder...');
  const projectCopyPath = path.join(inputDir, `${presentationName}.pdf`);
  await fs.copyFile(pdfPath, projectCopyPath);
  console.log(`\n✓ PDF saved to project: ${projectCopyPath}\n`);

  // Summary
  console.log('=== Generation Complete ===');
  console.log(`\nOutput location: ${outputDir}`);
  console.log(`  • ${pngPaths.length} PNG slides in /slides`);
  console.log(`  • 1 compiled PDF: ${presentationName}.pdf`);
  console.log(`\nProject copy: ${projectCopyPath}`);
  console.log('\nAll files ready for presentation!\n');
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
