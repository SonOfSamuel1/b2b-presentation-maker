#!/usr/bin/env node

const fs = require('fs').promises;
const PresentationCreator = require('./scripts/create-presentation');

async function main() {
  const creator = new PresentationCreator();

  // Discover styles first
  await creator.discoverStyles();

  // Read content from file
  const content = await fs.readFile('./temp-content.txt', 'utf8');

  // Set all parameters
  creator.setPresentationName('The Second Coming of Jesus');
  creator.setContent(content, 'markdown');
  await creator.setStyleBySelection(6); // Startup Presentation Style Guide

  // Create directories
  await fs.mkdir(creator.presentationDir, { recursive: true });
  await fs.mkdir(creator.workDir, { recursive: true });

  // Run the pipeline
  await creator.parseContent();
  await creator.generateImages();
  await creator.generateHTML();
  await creator.captureScreenshots();
  await creator.compilePDF();
  await creator.complete();
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
