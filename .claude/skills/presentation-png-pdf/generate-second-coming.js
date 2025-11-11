#!/usr/bin/env node

const PresentationCreator = require('./scripts/create-presentation');
const path = require('path');

async function main() {
  const creator = new PresentationCreator();

  // Set presentation name
  creator.setPresentationName('second-coming');

  // Discover style guides
  await creator.discoverStyles();

  // Select style guide #5 (Startup Presentation)
  await creator.setStyleBySelection(5);

  // Log extracted colors to verify
  console.log('\n=== EXTRACTED COLORS ===');
  console.log(JSON.stringify(creator.selectedStyle.tokens.colors, null, 2));
  console.log('========================\n');

  // Set content
  const content = `# The Second Coming of Jesus
Hope, Promise, and Eternal Glory

## Biblical Foundation
- Prophesied throughout Scripture
- Promised by Jesus Himself
- Affirmed by the apostles
- Central to Christian faith

## Signs of His Return
- Gospel preached to all nations
- Increase in knowledge and travel
- Wars and rumors of wars
- Natural disasters and upheavals
- Moral decline and deception

## The Rapture
The blessed hope of believers being caught up to meet the Lord in the air

## The Tribulation Period
A time of unprecedented trials before Christ's triumphant return to Earth

## Christ's Glorious Appearing
Every eye will see Him coming in power and glory with the angels

## The Millennial Kingdom
Jesus will reign on Earth for 1,000 years of peace and righteousness

## Our Response Today
- Live in readiness and expectation
- Share the Gospel urgently
- Grow in faith and holiness
- Encourage one another
- Look up with hope`;

  creator.setContent(content, 'markdown');

  // Parse content
  await creator.parseContent();

  // Generate images (skip for now)
  await creator.generateImages();

  // Generate HTML
  await creator.generateHTML();

  // Capture screenshots
  await creator.captureScreenshots();

  // Compile PDF
  await creator.compilePDF();

  // Complete
  await creator.complete();
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
