#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const ScreenshotGenerator = require('./scripts/screenshot-generator');
const PDFCompiler = require('./scripts/pdf-compiler');

async function generate12StonePresentation() {
  console.log('🎯 Converting 12Stone Church Presentation to PNG/PDF...\n');

  // Define paths
  const presentationDir = '/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker/12stone-church-presentation';

  // Output to TWO locations: Desktop + Project folder
  const desktopOutputDir = '/Users/terrancebrandon/Desktop/AI Presentations/12stone-church-2024-11-10';
  const projectOutputDir = path.join(presentationDir, 'exports');

  const desktopSlidesDir = path.join(desktopOutputDir, 'slides');
  const projectSlidesDir = path.join(projectOutputDir, 'slides');

  // Create output directories (both locations)
  [desktopOutputDir, desktopSlidesDir, projectOutputDir, projectSlidesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Define slide files
  const slides = [
    { file: 'slide-01-hero.html', name: '12stone-church-slide-01-hero.png' },
    { file: 'slide-02-agenda.html', name: '12stone-church-slide-02-agenda.png' },
    { file: 'slide-03-mission-vision.html', name: '12stone-church-slide-03-mission-vision.png' },
    { file: 'slide-04-history-impact.html', name: '12stone-church-slide-04-history-impact.png' },
    { file: 'slide-05-core-ministries.html', name: '12stone-church-slide-05-core-ministries.png' },
    { file: 'slide-06-community-impact.html', name: '12stone-church-slide-06-community-impact.png' },
    { file: 'slide-07-growth-expansion.html', name: '12stone-church-slide-07-growth-expansion.png' },
    { file: 'slide-08-thank-you.html', name: '12stone-church-slide-08-thank-you.png' }
  ];

  console.log(`📁 Input:  ${presentationDir}`);
  console.log(`📁 Output 1 (Desktop): ${desktopOutputDir}`);
  console.log(`📁 Output 2 (Project): ${projectOutputDir}\n`);

  // Initialize screenshot generator
  const screenshotGen = new ScreenshotGenerator({
    scale: 2, // 2x resolution (3840x2160)
    delay: 2000 // Wait for fonts/images to load
  });

  try {
    await screenshotGen.init();

    // Generate screenshots for each slide
    const pngPaths = [];

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const slideNumber = i + 1;
      const totalSlides = slides.length;

      console.log(`📸 [${slideNumber}/${totalSlides}] Capturing ${slide.file}...`);

      const htmlPath = path.join(presentationDir, slide.file);
      const desktopPngPath = path.join(desktopSlidesDir, slide.name);
      const projectPngPath = path.join(projectSlidesDir, slide.name);

      // Check if HTML file exists
      if (!fs.existsSync(htmlPath)) {
        console.error(`   ❌ File not found: ${htmlPath}`);
        continue;
      }

      // Generate screenshot to desktop location first
      await screenshotGen.captureScreenshot(htmlPath, desktopPngPath, slideNumber, totalSlides);
      pngPaths.push(desktopPngPath);

      // Copy to project location
      fs.copyFileSync(desktopPngPath, projectPngPath);

      console.log(`   ✅ Saved to Desktop & Project folders`);
    }

    await screenshotGen.close();

    console.log(`\n✨ All ${pngPaths.length} slides captured!\n`);

    // Compile PDF to both locations
    console.log('📄 Compiling PDFs...');
    const pdfCompiler = new PDFCompiler();
    const desktopPdfPath = path.join(desktopOutputDir, '12stone-church-presentation.pdf');
    const projectPdfPath = path.join(projectOutputDir, '12stone-church-presentation.pdf');

    // Generate PDF to desktop location
    await pdfCompiler.compile(pngPaths, desktopPdfPath);

    // Copy PDF to project location
    fs.copyFileSync(desktopPdfPath, projectPdfPath);

    console.log(`   ✅ PDF saved to Desktop & Project folders\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ PRESENTATION EXPORT COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 Summary:`);
    console.log(`   • ${pngPaths.length} PNG slides (3840x2160 @ 2x scale)`);
    console.log(`   • 1 compiled PDF`);
    console.log(`   • Saved to 2 locations (Desktop + Project)`);
    console.log(`\n📂 Desktop Location:`);
    console.log(`   • ${desktopOutputDir}/12stone-church-presentation.pdf`);
    console.log(`   • ${desktopOutputDir}/slides/ (8 PNG files)`);
    console.log(`\n📂 Project Location:`);
    console.log(`   • ${projectOutputDir}/12stone-church-presentation.pdf`);
    console.log(`   • ${projectOutputDir}/slides/ (8 PNG files)`);
    console.log('\n🎉 Ready to present or share!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Open both output folders
    const { exec } = require('child_process');
    exec(`open "${desktopOutputDir}"`);
    exec(`open "${projectOutputDir}"`);

  } catch (error) {
    console.error('\n❌ Error generating presentation:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the generator
generate12StonePresentation().catch(console.error);
