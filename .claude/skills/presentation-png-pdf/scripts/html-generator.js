const fs = require('fs').promises;
const path = require('path');
const SVGGenerator = require('../utils/svg-generator');

class HTMLGenerator {
  constructor(styleGuide = null) {
    this.styleGuide = styleGuide;
    this.svgGenerator = new SVGGenerator(styleGuide?.tokens?.colors || {});
    this.templatePath = path.join(__dirname, '../templates/slide-base.html');
  }

  /**
   * Generate HTML files for all slides
   * @param {Array} slides - Array of slide objects
   * @param {string} outputDir - Output directory for HTML files
   * @returns {Promise<Array>} Array of generated HTML file paths
   */
  async generateAll(slides, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });

    const template = await this.loadTemplate();
    const htmlPaths = [];

    for (const slide of slides) {
      const html = this.generateSlideHTML(slide, template, slides.length);
      const filename = `slide-${String(slide.number).padStart(2, '0')}.html`;
      const filePath = path.join(outputDir, filename);

      await fs.writeFile(filePath, html, 'utf-8');
      htmlPaths.push(filePath);

      console.log(`  Generated: ${filename}`);
    }

    return htmlPaths;
  }

  /**
   * Load HTML template
   * @returns {Promise<string>} Template content
   */
  async loadTemplate() {
    try {
      return await fs.readFile(this.templatePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to load template: ${error.message}`);
    }
  }

  /**
   * Generate HTML for a single slide
   * @param {Object} slide - Slide object
   * @param {string} template - HTML template
   * @param {number} totalSlides - Total number of slides
   * @returns {string} Generated HTML
   */
  generateSlideHTML(slide, template, totalSlides) {
    let html = template;

    // Replace placeholders
    html = html.replace('{{SLIDE_TITLE}}', this.escapeHtml(slide.title));
    html = html.replace('{{SLIDE_TYPE}}', slide.type || 'content');
    html = html.replace('{{SLIDE_NUMBER}}', slide.number);
    html = html.replace('{{TOTAL_SLIDES}}', totalSlides);
    html = html.replace('{{CUSTOM_CSS}}', this.generateCustomCSS());

    // Generate slide content
    const content = this.generateSlideContent(slide);
    html = html.replace('{{SLIDE_CONTENT}}', content);

    // Generate graphics
    const graphics = this.generateSlideGraphics(slide);
    html = html.replace('{{GRAPHICS}}', graphics);

    // Background pattern
    const pattern = this.generateBackgroundPattern(slide);
    html = html.replace('{{BACKGROUND_PATTERN}}', pattern);

    // Hero image placeholder
    const heroImage = slide.heroImagePath ?
      `<div class="hero-image"><img src="${slide.heroImagePath}" alt="Hero image"></div>` : '';
    html = html.replace('{{HERO_IMAGE}}', heroImage);

    // Determine if this is a dark theme slide (slides 3, 5, 7)
    const isDarkTheme = [3, 5, 7].includes(slide.number);
    html = html.replace('{{THEME_CLASS}}', isDarkTheme ? 'class="dark-theme"' : '');

    // Add gradient overlay to all slides
    html = html.replace('{{GRADIENT_OVERLAY}}', '<div class="gradient-overlay"></div>');

    // Add numbered badge (not on title slide)
    const badge = slide.type === 'title' ? '' :
      `<div class="slide-badge">${slide.number}</div>`;
    html = html.replace('{{SLIDE_BADGE}}', badge);

    return html;
  }

  /**
   * Generate custom CSS from style guide
   * @returns {string} CSS code
   */
  generateCustomCSS() {
    if (!this.styleGuide?.tokens?.colors) {
      return '';
    }

    const colors = this.styleGuide.tokens.colors;
    const fonts = this.styleGuide.tokens.fonts;

    return `:root {
  --color-primary: ${colors.primary || '#2563EB'};
  --color-secondary: ${colors.secondary || '#1E40AF'};
  --color-accent: ${colors.accent || '#F59E0B'};
  --color-background: ${colors.background || '#FFFFFF'};
  --color-text: ${colors.text || '#111827'};
  --color-dark-bg: #4A4A4A;
  --color-light-text: #FFFFFF;
  --font-body: ${fonts.primary || 'Inter, sans-serif'};
}`;
  }

  /**
   * Generate slide content HTML
   * @param {Object} slide - Slide object
   * @returns {string} Content HTML
   */
  generateSlideContent(slide) {
    if (slide.type === 'title' || slide.type === 'hero') {
      return this.generateTitleContent(slide);
    }

    return this.generateContentSlide(slide);
  }

  /**
   * Generate title slide content
   * @param {Object} slide - Slide object
   * @returns {string} Title slide HTML
   */
  generateTitleContent(slide) {
    let html = `<h1>${this.escapeHtml(slide.title)}</h1>`;

    if (slide.subtitle) {
      html += `<div class="subtitle">${this.escapeHtml(slide.subtitle)}</div>`;
    } else if (slide.content) {
      html += `<div class="subtitle">${this.escapeHtml(slide.content)}</div>`;
    }

    return html;
  }

  /**
   * Generate content slide HTML
   * @param {Object} slide - Slide object
   * @returns {string} Content slide HTML
   */
  generateContentSlide(slide) {
    let html = '';

    // Title
    html += `<h2>${this.escapeHtml(slide.title)}</h2>`;

    // Subtitle
    if (slide.subtitle) {
      html += `<h3>${this.escapeHtml(slide.subtitle)}</h3>`;
    }

    // Add subtle decorative SVG artwork
    html += this.generateDecorativeArtwork(slide);

    // Content layout
    if (slide.imagePath) {
      html += this.generateImageContentLayout(slide);
    } else if (slide.bullets && slide.bullets.length > 0) {
      html += '<div class="content-card">';
      html += this.generateBulletList(slide.bullets);
      html += '</div>';
    } else if (slide.content) {
      html += '<div class="content-card">';
      html += `<p>${this.escapeHtml(slide.content).replace(/\n/g, '<br>')}</p>`;
      html += '</div>';
    }

    return html;
  }

  /**
   * Generate subtle decorative SVG artwork based on slide content
   * @param {Object} slide - Slide object
   * @returns {string} SVG artwork HTML
   */
  generateDecorativeArtwork(slide) {
    const title = slide.title.toLowerCase();
    const content = (slide.content || '').toLowerCase();
    const accentColor = this.styleGuide?.tokens?.colors?.accent || '#A7D4F0';
    const isDark = [3, 5, 7].includes(slide.number);

    let svg = '';

    if (title.includes('foundation') || title.includes('biblical')) {
      // Book/scripture with decorative elements
      svg = `<div style="position: absolute; top: 100px; right: 140px; opacity: ${isDark ? '0.12' : '0.08'}; z-index: 0;">
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 60 L40 180 Q80 160, 120 180 Q160 160, 200 180 L200 60 Q160 80, 120 60 Q80 80, 40 60 Z" stroke="${accentColor}" stroke-width="2" fill="none"/>
          <line x1="120" y1="60" x2="120" y2="180" stroke="${accentColor}" stroke-width="1.5"/>
          <line x1="60" y1="90" x2="110" y2="90" stroke="${accentColor}" stroke-width="1" opacity="0.6"/>
          <line x1="60" y1="105" x2="105" y2="105" stroke="${accentColor}" stroke-width="1" opacity="0.6"/>
          <line x1="60" y1="120" x2="110" y2="120" stroke="${accentColor}" stroke-width="1" opacity="0.6"/>
          <line x1="130" y1="90" x2="180" y2="90" stroke="${accentColor}" stroke-width="1" opacity="0.6"/>
          <line x1="135" y1="105" x2="180" y2="105" stroke="${accentColor}" stroke-width="1" opacity="0.6"/>
          <line x1="130" y1="120" x2="175" y2="120" stroke="${accentColor}" stroke-width="1" opacity="0.6"/>
          <circle cx="120" cy="50" r="30" fill="${accentColor}" opacity="0.1"/>
        </svg>
      </div>`;
    } else if (title.includes('signs') || title.includes('indicating') || title.includes('near')) {
      // Compass/warning signs with celestial elements
      svg = `<div style="position: absolute; top: 100px; right: 120px; opacity: ${isDark ? '0.10' : '0.06'}; z-index: 0;">
        <svg width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="130" cy="130" r="80" stroke="${accentColor}" stroke-width="1.5"/>
          <circle cx="130" cy="130" r="60" stroke="${accentColor}" stroke-width="1" opacity="0.6"/>
          <path d="M130 50 L140 120 L130 130 L120 120 Z" fill="${accentColor}" opacity="0.4"/>
          <path d="M130 210 L120 140 L130 130 L140 140 Z" fill="${accentColor}" opacity="0.4"/>
          <path d="M50 130 L120 140 L130 130 L120 120 Z" fill="${accentColor}" opacity="0.3"/>
          <path d="M210 130 L140 120 L130 130 L140 140 Z" fill="${accentColor}" opacity="0.3"/>
          <circle cx="60" cy="60" r="4" fill="${accentColor}"/>
          <circle cx="200" cy="70" r="3" fill="${accentColor}"/>
          <circle cx="70" cy="200" r="3.5" fill="${accentColor}"/>
          <circle cx="190" cy="190" r="2.5" fill="${accentColor}"/>
        </svg>
      </div>`;
    } else if (title.includes('rapture') || content.includes('caught up') || title.includes('church')) {
      // Upward movement with clouds
      svg = `<div style="position: absolute; top: 80px; right: 100px; opacity: ${isDark ? '0.11' : '0.07'}; z-index: 0;">
        <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="80" cy="40" rx="35" ry="18" fill="${accentColor}" opacity="0.3"/>
          <ellipse cx="110" cy="35" rx="40" ry="20" fill="${accentColor}" opacity="0.4"/>
          <ellipse cx="140" cy="42" rx="32" ry="16" fill="${accentColor}" opacity="0.3"/>
          <path d="M50 220 L50 120 L45 130 M50 120 L55 130" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M110 240 L110 100 L105 110 M110 100 L115 110" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
          <path d="M170 230 L170 140 L165 150 M170 140 L175 150" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="110" y1="20" x2="50" y2="100" stroke="${accentColor}" stroke-width="0.8" opacity="0.5"/>
          <line x1="110" y1="20" x2="110" y2="90" stroke="${accentColor}" stroke-width="1.2" opacity="0.6"/>
          <line x1="110" y1="20" x2="170" y2="120" stroke="${accentColor}" stroke-width="0.8" opacity="0.5"/>
        </svg>
      </div>`;
    } else if (title.includes('tribulation') || content.includes('trials') || title.includes('testing') || title.includes('seven')) {
      // Storm/judgment with lightning
      svg = `<div style="position: absolute; bottom: 80px; right: 100px; opacity: ${isDark ? '0.10' : '0.06'}; z-index: 0;">
        <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="30" rx="45" ry="22" fill="${accentColor}" opacity="0.3"/>
          <ellipse cx="120" cy="25" rx="50" ry="25" fill="${accentColor}" opacity="0.4"/>
          <ellipse cx="180" cy="32" rx="42" ry="20" fill="${accentColor}" opacity="0.3"/>
          <path d="M80 50 L70 90 L85 90 L75 140" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M160 55 L150 95 L165 95 L155 145" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M0 120 Q 30 100, 60 120 T 120 120 T 180 120 T 240 120" stroke="${accentColor}" stroke-width="2.5" fill="none"/>
          <path d="M0 145 Q 30 125, 60 145 T 120 145 T 180 145 T 240 145" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.7"/>
        </svg>
      </div>`;
    } else if (title.includes('appearing') || title.includes('glorious') || content.includes('glory') || title.includes('with his saints')) {
      // Glory rays with crown
      svg = `<div style="position: absolute; top: 80px; right: 100px; opacity: ${isDark ? '0.09' : '0.05'}; z-index: 0;">
        <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="140" cy="140" r="25" fill="${accentColor}" opacity="0.3"/>
          <circle cx="140" cy="140" r="40" stroke="${accentColor}" stroke-width="1.5" opacity="0.4"/>
          <circle cx="140" cy="140" r="60" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
          <line x1="140" y1="140" x2="140" y2="20" stroke="${accentColor}" stroke-width="2"/>
          <line x1="140" y1="140" x2="230" y2="50" stroke="${accentColor}" stroke-width="1.5"/>
          <line x1="140" y1="140" x2="260" y2="140" stroke="${accentColor}" stroke-width="1.5"/>
          <line x1="140" y1="140" x2="230" y2="230" stroke="${accentColor}" stroke-width="1.5"/>
          <line x1="140" y1="140" x2="140" y2="260" stroke="${accentColor}" stroke-width="2"/>
          <line x1="140" y1="140" x2="50" y2="230" stroke="${accentColor}" stroke-width="1.5"/>
          <line x1="140" y1="140" x2="20" y2="140" stroke="${accentColor}" stroke-width="1.5"/>
          <line x1="140" y1="140" x2="50" y2="50" stroke="${accentColor}" stroke-width="1.5"/>
          <path d="M140 15 L145 25 L150 20 L148 30 L155 28 L150 35" stroke="${accentColor}" stroke-width="1.2"/>
          <path d="M140 15 L135 25 L130 20 L132 30 L125 28 L130 35" stroke="${accentColor}" stroke-width="1.2"/>
        </svg>
      </div>`;
    } else if (title.includes('kingdom') || title.includes('millennial')) {
      // Crown/throne with peace symbols
      svg = `<div style="position: absolute; top: 100px; right: 120px; opacity: ${isDark ? '0.11' : '0.07'}; z-index: 0;">
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 120 L60 80 L80 110 L120 60 L160 110 L180 80 L200 120" stroke="${accentColor}" stroke-width="2.5" fill="none"/>
          <line x1="40" y1="120" x2="200" y2="120" stroke="${accentColor}" stroke-width="3"/>
          <line x1="50" y1="120" x2="50" y2="140" stroke="${accentColor}" stroke-width="2"/>
          <line x1="120" y1="120" x2="120" y2="145" stroke="${accentColor}" stroke-width="2"/>
          <line x1="190" y1="120" x2="190" y2="140" stroke="${accentColor}" stroke-width="2"/>
          <path d="M60 170 Q80 160, 100 170" stroke="${accentColor}" stroke-width="1.5" fill="none"/>
          <path d="M140 175 Q160 165, 180 175" stroke="${accentColor}" stroke-width="1.5" fill="none"/>
          <circle cx="120" cy="40" r="8" fill="${accentColor}" opacity="0.5"/>
          <circle cx="70" cy="70" r="5" fill="${accentColor}" opacity="0.4"/>
          <circle cx="170" cy="70" r="5" fill="${accentColor}" opacity="0.4"/>
        </svg>
      </div>`;
    } else if (title.includes('response') || title.includes('live') || title.includes('today')) {
      // Heart/prayer hands with action symbols
      svg = `<div style="position: absolute; top: 100px; right: 130px; opacity: ${isDark ? '0.10' : '0.06'}; z-index: 0;">
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M120 200 C120 200, 40 130, 40 80 C40 50, 60 30, 85 30 C100 30, 115 40, 120 55 C125 40, 140 30, 155 30 C180 30, 200 50, 200 80 C200 130, 120 200, 120 200 Z" stroke="${accentColor}" stroke-width="2" fill="none"/>
          <path d="M110 100 L110 140 L105 145 L105 155" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
          <path d="M130 100 L130 140 L135 145 L135 155" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
          <path d="M105 105 L135 105" stroke="${accentColor}" stroke-width="1.5"/>
          <line x1="120" y1="75" x2="120" y2="60" stroke="${accentColor}" stroke-width="1" opacity="0.6"/>
          <line x1="95" y1="85" x2="85" y2="75" stroke="${accentColor}" stroke-width="0.8" opacity="0.5"/>
          <line x1="145" y1="85" x2="155" y2="75" stroke="${accentColor}" stroke-width="0.8" opacity="0.5"/>
        </svg>
      </div>`;
    }

    return svg;
  }

  /**
   * Generate layout with image and content
   * @param {Object} slide - Slide object
   * @returns {string} HTML layout
   */
  generateImageContentLayout(slide) {
    const imagePosition = slide.imagePosition || 'right';
    const imageHtml = `<div class="image-area"><img src="${slide.imagePath}" alt="${slide.title}"></div>`;
    const contentHtml = `
      <div class="content-area">
        ${slide.bullets ? this.generateBulletList(slide.bullets) :
          slide.content ? `<p>${this.escapeHtml(slide.content)}</p>` : ''}
      </div>
    `;

    if (imagePosition === 'left') {
      return `<div class="image-left">${imageHtml}${contentHtml}</div>`;
    } else {
      return `<div class="image-right">${contentHtml}${imageHtml}</div>`;
    }
  }

  /**
   * Generate bullet list HTML
   * @param {Array} bullets - Bullet points
   * @returns {string} Bullet list HTML
   */
  generateBulletList(bullets) {
    const items = bullets.map(bullet =>
      `<li>${this.escapeHtml(bullet)}</li>`
    ).join('\n');

    return `<ul>\n${items}\n</ul>`;
  }

  /**
   * Generate SVG graphics for slide
   * @param {Object} slide - Slide object
   * @returns {string} Graphics HTML
   */
  generateSlideGraphics(slide) {
    if (!slide.graphics || slide.graphics.length === 0) {
      return '';
    }

    let html = '<div class="graphics-container">';

    for (const graphic of slide.graphics) {
      if (graphic.type === 'icon') {
        // Generate icons (e.g., checkmarks for bullets)
        const count = graphic.count || 1;
        for (let i = 0; i < count; i++) {
          const svg = this.svgGenerator.generate('icon', {
            name: graphic.name || 'checkmark',
            size: graphic.size || 48,
            color: this.styleGuide?.tokens?.colors?.primary
          });
          html += `<div class="graphic-item">${svg}</div>`;
        }
      } else if (graphic.type === 'chart') {
        // Generate chart
        const svg = this.svgGenerator.generate('chart', {
          type: graphic.chartType || 'bar',
          values: graphic.values || [40, 65, 85, 70, 90],
          labels: graphic.labels,
          width: graphic.width || 800,
          height: graphic.height || 400
        });
        html += `<div class="graphic-item">${svg}</div>`;
      } else {
        // Generate other graphic types
        const svg = this.svgGenerator.generate(graphic.type, graphic);
        html += `<div class="graphic-item">${svg}</div>`;
      }
    }

    html += '</div>';

    return html;
  }

  /**
   * Generate background pattern
   * @param {Object} slide - Slide object
   * @returns {string} Pattern SVG HTML
   */
  generateBackgroundPattern(slide) {
    // Add subtle dot pattern to all slides except title
    if (slide.type === 'title') {
      return '';
    }

    const pattern = this.svgGenerator.generate('pattern', {
      patternType: 'dots',
      width: 1920,
      height: 1080,
      spacing: 80,
      dotSize: 3,
      color: this.styleGuide?.tokens?.colors?.accent || '#A7D4F0'
    });

    return `<div class="pattern-background">${pattern}</div>`;
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    if (!text) return '';

    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Add custom styles to specific slide
   * @param {Object} slide - Slide object
   * @param {string} customCSS - Additional CSS
   */
  addCustomStyles(slide, customCSS) {
    slide.customCSS = customCSS;
  }
}

module.exports = HTMLGenerator;
