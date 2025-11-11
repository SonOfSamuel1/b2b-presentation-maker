const HTMLGenerator = require('./html-generator');
const fs = require('fs').promises;
const path = require('path');

/**
 * Test suite for HTMLGenerator with new template features
 */
async function runTests() {
  console.log('\n=== Testing HTML Generator with New Template Features ===\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: CSS Variables Injection
  console.log('Test 1: CSS Variables Injection');
  try {
    const styleGuide = {
      tokens: {
        colors: {
          primary: '#0066CC',
          secondary: '#003366',
          accent: '#FF6600',
          background: '#FFFFFF',
          text: '#000000'
        },
        fonts: {
          primary: 'Arial, sans-serif'
        }
      }
    };

    const generator = new HTMLGenerator(styleGuide);
    const css = generator.generateCustomCSS();

    // Check if CSS contains all variables
    const checks = [
      css.includes('--color-primary: #0066CC'),
      css.includes('--color-secondary: #003366'),
      css.includes('--color-accent: #FF6600'),
      css.includes('--color-background: #FFFFFF'),
      css.includes('--color-text: #000000'),
      css.includes('--color-dark-bg: #4A4A4A'),
      css.includes('--color-light-text: #FFFFFF'),
      css.includes('--font-body: Arial, sans-serif'),
      css.includes(':root {')
    ];

    if (checks.every(check => check)) {
      console.log('  ✓ CSS variables correctly injected\n');
      testsPassed++;
    } else {
      console.log('  ✗ CSS variables missing or incorrect\n');
      console.log('Generated CSS:', css);
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    testsFailed++;
  }

  // Test 2: Dark Theme Class Assignment
  console.log('Test 2: Dark Theme Class Assignment');
  try {
    const generator = new HTMLGenerator();
    const template = `
      <!DOCTYPE html>
      <html {{THEME_CLASS}}>
      <head><title>{{SLIDE_TITLE}}</title></head>
      <body>
        {{GRADIENT_OVERLAY}}
        {{SLIDE_BADGE}}
        {{SLIDE_CONTENT}}
        {{GRAPHICS}}
        {{BACKGROUND_PATTERN}}
        {{HERO_IMAGE}}
        <style>{{CUSTOM_CSS}}</style>
      </body>
      </html>
    `;

    const slides = [
      { number: 1, title: 'Slide 1', type: 'title', content: 'Test' },
      { number: 2, title: 'Slide 2', type: 'content', content: 'Test' },
      { number: 3, title: 'Slide 3', type: 'content', content: 'Test' },
      { number: 4, title: 'Slide 4', type: 'content', content: 'Test' },
      { number: 5, title: 'Slide 5', type: 'content', content: 'Test' },
      { number: 6, title: 'Slide 6', type: 'content', content: 'Test' },
      { number: 7, title: 'Slide 7', type: 'content', content: 'Test' }
    ];

    const results = slides.map(slide => {
      const html = generator.generateSlideHTML(slide, template, slides.length);
      const hasDarkTheme = html.includes('class="dark-theme"');
      const shouldHaveDarkTheme = [3, 5, 7].includes(slide.number);
      return hasDarkTheme === shouldHaveDarkTheme;
    });

    if (results.every(result => result)) {
      console.log('  ✓ Dark theme correctly applied to slides 3, 5, 7\n');
      testsPassed++;
    } else {
      console.log('  ✗ Dark theme not correctly applied\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    testsFailed++;
  }

  // Test 3: Gradient Overlay
  console.log('Test 3: Gradient Overlay');
  try {
    const generator = new HTMLGenerator();
    const template = '{{GRADIENT_OVERLAY}}{{SLIDE_CONTENT}}{{GRAPHICS}}{{BACKGROUND_PATTERN}}{{HERO_IMAGE}}<style>{{CUSTOM_CSS}}</style>';
    const slide = { number: 2, title: 'Test', type: 'content', content: 'Test content' };
    const html = generator.generateSlideHTML(slide, template, 5);

    if (html.includes('<div class="gradient-overlay"></div>')) {
      console.log('  ✓ Gradient overlay present\n');
      testsPassed++;
    } else {
      console.log('  ✗ Gradient overlay missing\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    testsFailed++;
  }

  // Test 4: Slide Badge (Not on Title Slide)
  console.log('Test 4: Slide Badge');
  try {
    const generator = new HTMLGenerator();
    const template = '{{SLIDE_BADGE}}{{SLIDE_CONTENT}}{{GRADIENT_OVERLAY}}{{GRAPHICS}}{{BACKGROUND_PATTERN}}{{HERO_IMAGE}}<style>{{CUSTOM_CSS}}</style>';

    const titleSlide = { number: 1, title: 'Title', type: 'title', content: 'Title slide' };
    const contentSlide = { number: 2, title: 'Content', type: 'content', content: 'Content slide' };

    const titleHtml = generator.generateSlideHTML(titleSlide, template, 5);
    const contentHtml = generator.generateSlideHTML(contentSlide, template, 5);

    const titleHasNoBadge = !titleHtml.includes('<div class="slide-badge">');
    const contentHasBadge = contentHtml.includes('<div class="slide-badge">2</div>');

    if (titleHasNoBadge && contentHasBadge) {
      console.log('  ✓ Slide badge correctly shown (not on title slide)\n');
      testsPassed++;
    } else {
      console.log('  ✗ Slide badge not correctly implemented\n');
      console.log('  Title has no badge:', titleHasNoBadge);
      console.log('  Content has badge:', contentHasBadge);
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    testsFailed++;
  }

  // Test 5: Content Card Wrapping
  console.log('Test 5: Content Card Wrapping');
  try {
    const generator = new HTMLGenerator();

    // Test with bullets
    const bulletSlide = {
      number: 2,
      title: 'Test',
      type: 'content',
      bullets: ['Point 1', 'Point 2', 'Point 3']
    };

    // Test with paragraph content
    const contentSlide = {
      number: 3,
      title: 'Test',
      type: 'content',
      content: 'This is test content'
    };

    const bulletHtml = generator.generateContentSlide(bulletSlide);
    const contentHtml = generator.generateContentSlide(contentSlide);

    const bulletWrapped = bulletHtml.includes('<div class="content-card">') &&
                          bulletHtml.includes('</div>') &&
                          bulletHtml.includes('<ul>');

    const contentWrapped = contentHtml.includes('<div class="content-card">') &&
                           contentHtml.includes('</div>') &&
                           contentHtml.includes('<p>');

    if (bulletWrapped && contentWrapped) {
      console.log('  ✓ Content correctly wrapped in content-card\n');
      testsPassed++;
    } else {
      console.log('  ✗ Content not correctly wrapped\n');
      console.log('  Bullets wrapped:', bulletWrapped);
      console.log('  Content wrapped:', contentWrapped);
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    testsFailed++;
  }

  // Test 6: Background Pattern (Not on Title Slide)
  console.log('Test 6: Background Pattern');
  try {
    const styleGuide = {
      tokens: {
        colors: {
          accent: '#A7D4F0'
        }
      }
    };

    const generator = new HTMLGenerator(styleGuide);

    const titleSlide = { number: 1, title: 'Title', type: 'title' };
    const contentSlide = { number: 2, title: 'Content', type: 'content' };

    const titlePattern = generator.generateBackgroundPattern(titleSlide);
    const contentPattern = generator.generateBackgroundPattern(contentSlide);

    const titleHasNoPattern = titlePattern === '';
    const contentHasPattern = contentPattern.includes('<div class="pattern-background">') &&
                              contentPattern.includes('<svg');

    if (titleHasNoPattern && contentHasPattern) {
      console.log('  ✓ Background pattern correctly applied (not on title slide)\n');
      testsPassed++;
    } else {
      console.log('  ✗ Background pattern not correctly implemented\n');
      console.log('  Title has no pattern:', titleHasNoPattern);
      console.log('  Content has pattern:', contentHasPattern);
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    testsFailed++;
  }

  // Test 7: Integration Test - Generate Complete HTML
  console.log('Test 7: Integration Test - Complete HTML Generation');
  try {
    const styleGuide = {
      tokens: {
        colors: {
          primary: '#0066CC',
          secondary: '#003366',
          accent: '#FF6600',
          background: '#FFFFFF',
          text: '#000000'
        },
        fonts: {
          primary: 'Inter, sans-serif'
        }
      }
    };

    const generator = new HTMLGenerator(styleGuide);
    const template = `<!DOCTYPE html>
<html {{THEME_CLASS}}>
<head>
  <title>{{SLIDE_TITLE}}</title>
  <style>{{CUSTOM_CSS}}</style>
</head>
<body>
  {{GRADIENT_OVERLAY}}
  {{SLIDE_BADGE}}
  <main>{{SLIDE_CONTENT}}</main>
  {{GRAPHICS}}
  {{BACKGROUND_PATTERN}}
  {{HERO_IMAGE}}
</body>
</html>`;

    const slide = {
      number: 3,
      title: 'Key Features',
      type: 'content',
      bullets: ['Feature 1', 'Feature 2', 'Feature 3']
    };

    const html = generator.generateSlideHTML(slide, template, 7);

    const checks = [
      html.includes('class="dark-theme"'),
      html.includes('<div class="gradient-overlay"></div>'),
      html.includes('<div class="slide-badge">3</div>'),
      html.includes('<div class="content-card">'),
      html.includes('--color-primary: #0066CC'),
      html.includes('<div class="pattern-background">')
    ];

    if (checks.every(check => check)) {
      console.log('  ✓ Complete HTML generation successful\n');
      testsPassed++;
    } else {
      console.log('  ✗ Complete HTML generation failed\n');
      console.log('  Checks:', checks);
      testsFailed++;
    }
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    testsFailed++;
  }

  // Summary
  console.log('=== Test Summary ===');
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log(`Total Tests: ${testsPassed + testsFailed}`);

  if (testsFailed === 0) {
    console.log('\n✓ All tests passed!\n');
    return true;
  } else {
    console.log('\n✗ Some tests failed.\n');
    return false;
  }
}

// Run tests if executed directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution error:', error);
      process.exit(1);
    });
}

module.exports = { runTests };
