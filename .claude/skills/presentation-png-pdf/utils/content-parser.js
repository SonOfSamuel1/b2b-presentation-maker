/**
 * Content Parser
 * Parses various input formats into structured slide data
 */

class ContentParser {
  constructor() {
    this.slides = [];
  }

  /**
   * Parse content based on format detection
   * @param {string} content - Input content
   * @param {string} format - Format hint (markdown, outline, text, auto)
   * @returns {Array} Array of slide objects
   */
  parse(content, format = 'auto') {
    if (!content || content.trim().length === 0) {
      throw new Error('Content is empty');
    }

    // Auto-detect format if needed
    if (format === 'auto') {
      format = this.detectFormat(content);
    }

    // Parse based on format
    switch (format) {
      case 'markdown':
        return this.parseMarkdown(content);
      case 'outline':
        return this.parseOutline(content);
      case 'json':
        return this.parseJSON(content);
      default:
        return this.parseText(content);
    }
  }

  /**
   * Detect content format
   * @param {string} content - Input content
   * @returns {string} Detected format
   */
  detectFormat(content) {
    // Check for JSON
    if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
      try {
        JSON.parse(content);
        return 'json';
      } catch (e) {
        // Not valid JSON
      }
    }

    // Check for markdown headings
    if (/^#{1,6}\s+/m.test(content)) {
      return 'markdown';
    }

    // Check for numbered/bulleted outline
    if (/^\s*[\d\-\*]\.\s+/m.test(content)) {
      return 'outline';
    }

    // Default to plain text
    return 'text';
  }

  /**
   * Parse markdown format
   * Each H1 or H2 becomes a slide
   * @param {string} content - Markdown content
   * @returns {Array} Slide objects
   */
  parseMarkdown(content) {
    const slides = [];
    const lines = content.split('\n');
    let currentSlide = null;
    let slideNumber = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // H1 creates a new title slide
      if (/^#\s+(.+)/.test(line)) {
        if (currentSlide) slides.push(currentSlide);

        const title = line.replace(/^#\s+/, '').trim();
        slideNumber++;

        currentSlide = {
          number: slideNumber,
          type: 'title',
          title: title,
          content: '',
          bullets: [],
          needsImage: true
        };
      }
      // H2 creates a new content slide
      else if (/^##\s+(.+)/.test(line)) {
        if (currentSlide) slides.push(currentSlide);

        const title = line.replace(/^##\s+/, '').trim();
        slideNumber++;

        currentSlide = {
          number: slideNumber,
          type: 'content',
          title: title,
          content: '',
          bullets: [],
          needsImage: false
        };
      }
      // H3 creates a subsection in current slide
      else if (/^###\s+(.+)/.test(line) && currentSlide) {
        const subtitle = line.replace(/^###\s+/, '').trim();
        currentSlide.subtitle = subtitle;
      }
      // Bullet points
      else if (/^\s*[\-\*\+]\s+(.+)/.test(line) && currentSlide) {
        const bullet = line.replace(/^\s*[\-\*\+]\s+/, '').trim();
        currentSlide.bullets.push(bullet);
      }
      // Numbered lists
      else if (/^\s*\d+\.\s+(.+)/.test(line) && currentSlide) {
        const bullet = line.replace(/^\s*\d+\.\s+/, '').trim();
        currentSlide.bullets.push(bullet);
      }
      // Regular text
      else if (line.trim().length > 0 && currentSlide) {
        currentSlide.content += (currentSlide.content ? '\n' : '') + line.trim();
      }
    }

    // Add last slide
    if (currentSlide) slides.push(currentSlide);

    // If no slides were created, make a single slide
    if (slides.length === 0) {
      slides.push({
        number: 1,
        type: 'content',
        title: 'Untitled',
        content: content,
        bullets: [],
        needsImage: false
      });
    }

    return this.enrichSlides(slides);
  }

  /**
   * Parse outline format
   * Top-level items are slides, sub-items are bullets
   * @param {string} content - Outline content
   * @returns {Array} Slide objects
   */
  parseOutline(content) {
    const slides = [];
    const lines = content.split('\n');
    let currentSlide = null;
    let slideNumber = 0;

    for (const line of lines) {
      if (line.trim().length === 0) continue;

      // Top-level item (slide title)
      if (/^[\d\-\*]+\.\s+(.+)/.test(line) && !line.startsWith('  ')) {
        if (currentSlide) slides.push(currentSlide);

        slideNumber++;
        const title = line.replace(/^[\d\-\*]+\.\s+/, '').trim();

        currentSlide = {
          number: slideNumber,
          type: slideNumber === 1 ? 'title' : 'content',
          title: title,
          content: '',
          bullets: [],
          needsImage: slideNumber === 1
        };
      }
      // Sub-item (bullet point)
      else if (/^\s+[\d\-\*]+\.\s+(.+)/.test(line) && currentSlide) {
        const bullet = line.replace(/^\s+[\d\-\*]+\.\s+/, '').trim();
        currentSlide.bullets.push(bullet);
      }
      // Unindented text
      else if (currentSlide) {
        currentSlide.content += (currentSlide.content ? '\n' : '') + line.trim();
      }
    }

    if (currentSlide) slides.push(currentSlide);

    return this.enrichSlides(slides);
  }

  /**
   * Parse JSON format
   * @param {string} content - JSON content
   * @returns {Array} Slide objects
   */
  parseJSON(content) {
    try {
      const data = JSON.parse(content);

      // If array, treat each item as a slide
      if (Array.isArray(data)) {
        return this.enrichSlides(data.map((slide, i) => ({
          number: i + 1,
          type: i === 0 ? 'title' : slide.type || 'content',
          title: slide.title || 'Untitled',
          subtitle: slide.subtitle || '',
          content: slide.content || '',
          bullets: slide.bullets || [],
          needsImage: slide.needsImage !== undefined ? slide.needsImage : (i === 0)
        })));
      }

      // If object with slides property
      if (data.slides && Array.isArray(data.slides)) {
        return this.enrichSlides(data.slides);
      }

      throw new Error('Invalid JSON structure');
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  }

  /**
   * Parse plain text
   * Split by paragraphs, each becomes a slide
   * @param {string} content - Text content
   * @returns {Array} Slide objects
   */
  parseText(content) {
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);

    if (paragraphs.length === 0) {
      return [{
        number: 1,
        type: 'content',
        title: 'Content',
        content: content.trim(),
        bullets: [],
        needsImage: false
      }];
    }

    const slides = paragraphs.map((para, i) => {
      // First sentence as title
      const sentences = para.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const title = sentences[0]?.trim() || `Slide ${i + 1}`;
      const content = sentences.slice(1).join('. ').trim();

      return {
        number: i + 1,
        type: i === 0 ? 'title' : 'content',
        title: title,
        content: content,
        bullets: [],
        needsImage: i === 0
      };
    });

    return this.enrichSlides(slides);
  }

  /**
   * Enrich slides with additional metadata
   * @param {Array} slides - Raw slide objects
   * @returns {Array} Enriched slides
   */
  enrichSlides(slides) {
    return slides.map((slide, index) => {
      // Ensure required fields
      slide.number = slide.number || index + 1;
      slide.type = slide.type || (index === 0 ? 'title' : 'content');
      slide.title = slide.title || `Slide ${slide.number}`;
      slide.content = slide.content || '';
      slide.bullets = slide.bullets || [];

      // Determine if slide needs an image
      if (slide.needsImage === undefined) {
        slide.needsImage = this.slideNeedsImage(slide);
      }

      // Determine SVG graphics needed
      slide.graphics = this.determineGraphics(slide);

      return slide;
    });
  }

  /**
   * Determine if slide needs a generated image
   * @param {Object} slide - Slide object
   * @returns {boolean} Whether slide needs image
   */
  slideNeedsImage(slide) {
    // Title/hero slides usually need images
    if (slide.type === 'title' || slide.type === 'hero') {
      return true;
    }

    // Slides with specific keywords might need images
    const imageKeywords = ['photo', 'image', 'picture', 'visual', 'showcase'];
    const slideText = `${slide.title} ${slide.content}`.toLowerCase();

    return imageKeywords.some(keyword => slideText.includes(keyword));
  }

  /**
   * Determine what graphics a slide needs
   * @param {Object} slide - Slide object
   * @returns {Array} Graphics specifications
   */
  determineGraphics(slide) {
    const graphics = [];

    // Bullet points get checkmarks
    if (slide.bullets && slide.bullets.length > 0) {
      graphics.push({ type: 'icon', name: 'checkmark', count: slide.bullets.length });
    }

    // Data-related slides get charts
    const dataKeywords = ['data', 'chart', 'graph', 'metrics', 'statistics', 'numbers', 'results'];
    const slideText = `${slide.title} ${slide.content}`.toLowerCase();

    if (dataKeywords.some(kw => slideText.includes(kw))) {
      graphics.push({ type: 'chart', chartType: 'bar' });
    }

    // Growth/trending slides get trend icons
    if (slideText.includes('growth') || slideText.includes('increase') || slideText.includes('trending')) {
      graphics.push({ type: 'icon', name: 'trending' });
    }

    // Target/goal slides get target icons
    if (slideText.includes('goal') || slideText.includes('target') || slideText.includes('objective')) {
      graphics.push({ type: 'icon', name: 'target' });
    }

    return graphics;
  }

  /**
   * Validate parsed slides
   * @param {Array} slides - Slides to validate
   * @returns {Object} Validation result
   */
  validate(slides) {
    const errors = [];
    const warnings = [];

    if (!Array.isArray(slides) || slides.length === 0) {
      errors.push('No slides found');
      return { valid: false, errors, warnings };
    }

    slides.forEach((slide, i) => {
      if (!slide.title || slide.title.trim().length === 0) {
        warnings.push(`Slide ${i + 1} has no title`);
      }

      if (!slide.content && (!slide.bullets || slide.bullets.length === 0)) {
        warnings.push(`Slide ${i + 1} has no content`);
      }

      if (slide.bullets && slide.bullets.length > 7) {
        warnings.push(`Slide ${i + 1} has ${slide.bullets.length} bullets (recommend max 5-7)`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      slideCount: slides.length
    };
  }
}

module.exports = ContentParser;
